import { useState, useEffect, useCallback } from "react"
import { ApiError } from "../services/api"

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({ data: null, loading: true, error: null })

  const run = useCallback(() => {
    setState({ data: null, loading: true, error: null })
    fn()
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => {
        const message = err instanceof ApiError ? err.message : "Something went wrong"
        setState({ data: null, loading: false, error: message })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ...state, refetch: run }
}
