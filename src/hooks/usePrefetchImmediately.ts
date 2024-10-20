import { PrefetchOptions } from "@reduxjs/toolkit/query"
import { appApi } from "@/src/features/api.service"
import { useAppDispatch } from "./hooks"
import { useEffect } from "react"

type EndpointNames = keyof typeof appApi.endpoints

export function usePrefetchImmediately<T extends EndpointNames>(
  endpoint: T,
  arg: Parameters<(typeof appApi.endpoints)[T]['initiate']>[0],
  options: PrefetchOptions = {}
) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(appApi.util.prefetch(endpoint, arg as any, options))
  }, [])
}

// In a component
