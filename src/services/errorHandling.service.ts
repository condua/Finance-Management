import {
  isRejected,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
  UnknownAction,
} from '@reduxjs/toolkit'
import Toast from 'react-native-toast-message'
function isPayloadErrorMessage(
  payload: unknown
): payload is { data: { error: string }; status: number } {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    'error' in (payload as any).data &&
    typeof (payload as any).data?.error === 'string' &&
    'status' in payload
  )
}

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action: unknown) => {
    // if(isRejectedWithValue(action) ) {
    //   if(action.error.name === 'CustomError') {
    //     console.log(action.error.message)
    //   }
    // }
    // useLocale('action', action)
    if (isRejectedWithValue(action)) {
      if (isPayloadErrorMessage(action.payload)) {
        console.log(action.payload.data.error)
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: action.payload.data.error,
        })
      }
    }
    return next(action)
  }

export class CustomError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomError'
  }
}
