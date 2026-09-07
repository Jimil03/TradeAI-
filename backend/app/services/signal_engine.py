from app.services.market_data import get_historical_candles, get_news_sentiment

DISCLAIMER = (
    "This is an educational, probability-based signal derived from historical price "
    "patterns and recent news sentiment. It is not financial advice, does not predict "
    "future prices, and past patterns do not guarantee future results."
)


def _sma(values: list[float], period: int) -> float | None:
    if len(values) < period:
        return None
    return sum(values[-period:]) / period


def _rsi(closes: list[float], period: int = 14) -> float | None:
    if len(closes) < period + 1:
        return None
    gains, losses = [], []
    for i in range(1, len(closes)):
        change = closes[i] - closes[i - 1]
        gains.append(max(change, 0))
        losses.append(max(-change, 0))

    avg_gain = sum(gains[-period:]) / period
    avg_loss = sum(losses[-period:]) / period
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))


def _atr(candles: list[dict], period: int = 14) -> float | None:
    if len(candles) < period + 1:
        return None
    true_ranges = []
    for i in range(1, len(candles)):
        high, low, prev_close = candles[i]["high"], candles[i]["low"], candles[i - 1]["close"]
        tr = max(high - low, abs(high - prev_close), abs(low - prev_close))
        true_ranges.append(tr)
    return sum(true_ranges[-period:]) / period


def generate_signal(symbol: str) -> dict:
    candles = get_historical_candles(symbol)
    sentiment = get_news_sentiment(symbol)

    if candles is None or len(candles) < 20:
        return {
            "symbol": symbol.upper(),
            "data_available": False,
            "direction_probability_up": None,
            "direction_probability_down": None,
            "confidence_level": "none",
            "key_factors": [],
            "disclaimer": DISCLAIMER,
            "message": "Not enough historical price data available for this symbol.",
        }

    closes = [c["close"] for c in candles]
    sma_20 = _sma(closes, 20)
    sma_50 = _sma(closes, 50)
    rsi = _rsi(closes)
    atr = _atr(candles)

    # Start neutral; each factor nudges the score up or down. Capped so no single
    # factor can push it to false-certainty territory.
    score = 50.0
    factors = []

    if sma_20 is not None and sma_50 is not None:
        if sma_20 > sma_50:
            score += 8
            factors.append(f"20-day average ({sma_20:.2f}) is above the 50-day average ({sma_50:.2f}), an uptrend signal")
        else:
            score -= 8
            factors.append(f"20-day average ({sma_20:.2f}) is below the 50-day average ({sma_50:.2f}), a downtrend signal")

    if rsi is not None:
        if rsi > 70:
            score -= 6
            factors.append(f"RSI at {rsi:.1f} suggests the stock may be overbought")
        elif rsi < 30:
            score += 6
            factors.append(f"RSI at {rsi:.1f} suggests the stock may be oversold")
        else:
            factors.append(f"RSI at {rsi:.1f} is in a neutral range")

    if sentiment and sentiment.get("bullish_pct") is not None:
        bullish = sentiment["bullish_pct"] * 100
        bearish = sentiment["bearish_pct"] * 100
        sentiment_tilt = (bullish - bearish) / 2  # scaled, modest influence
        score += sentiment_tilt
        factors.append(f"recent news sentiment is {bullish:.0f}% bullish / {bearish:.0f}% bearish")
    else:
        factors.append("no recent news sentiment data available for this symbol")

    # Clamp to a range that never claims near-certainty
    score = max(30.0, min(70.0, score))

    confidence = "low"
    if candles and len(candles) >= 60 and sentiment:
        confidence = "medium"
    if candles and len(candles) >= 90 and sentiment and sentiment.get("articles_last_week", 0) >= 5:
        confidence = "high"

    return {
        "symbol": symbol.upper(),
        "data_available": True,
        "direction_probability_up": round(score, 1),
        "direction_probability_down": round(100 - score, 1),
        "confidence_level": confidence,
        "key_factors": factors,
        "volatility_atr": round(atr, 2) if atr is not None else None,
        "disclaimer": DISCLAIMER,
    }