from datetime import datetime, timedelta

import httpx

from app.core.config import settings

BASE_URL = "https://finnhub.io/api/v1"


def get_historical_candles(symbol: str, days: int = 90) -> list[dict] | None:
    """Returns a list of daily candles via Alpha Vantage: [{date, open, high, low, close, volume}, ...] or None on failure."""
    try:
        response = httpx.get(
            "https://www.alphavantage.co/query",
            params={
                "function": "TIME_SERIES_DAILY",
                "symbol": symbol.upper(),
                "outputsize": "compact",  # last 100 days
                "apikey": settings.alpha_vantage_api_key,
            },
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()

        series = data.get("Time Series (Daily)")
        if not series:
            return None

        candles = []
        for date_str, values in sorted(series.items()):
            candles.append({
                "date": date_str,
                "open": float(values["1. open"]),
                "high": float(values["2. high"]),
                "low": float(values["3. low"]),
                "close": float(values["4. close"]),
                "volume": float(values["5. volume"]),
            })
        return candles[-days:]
    except Exception:
        return None


def get_news_sentiment(symbol: str) -> dict | None:
    """Returns Finnhub's aggregated sentiment score for a symbol, or None on failure."""
    try:
        response = httpx.get(
            f"{BASE_URL}/news-sentiment",
            params={"symbol": symbol.upper(), "token": settings.finnhub_api_key},
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()

        sentiment = data.get("sentiment")
        if not sentiment:
            return None

        return {
            "bullish_pct": sentiment.get("bullishPercent"),
            "bearish_pct": sentiment.get("bearishPercent"),
            "articles_last_week": data.get("buzz", {}).get("articlesInLastWeek"),
        }
    except Exception:
        return None