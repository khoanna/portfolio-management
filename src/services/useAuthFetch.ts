// hooks/useAuthFetch.ts
'use client'

import { useRouter } from 'next/navigation'
import { getToken, saveToken } from './Token'
import useAuth from '@/services/useAuth'

type FetchInit = RequestInit & { _retry?: boolean }

export default function useAuthFetch() {
    const { refresh } = useAuth()
    const router = useRouter()

    const authFetch = async (input: RequestInfo | URL, init?: FetchInit) => {
        const makeHeaders = (token?: string | null, base?: HeadersInit) => {
            const h = new Headers(base)
            if (token) h.set('Authorization', `Bearer ${token}`)
            return h
        }

        const doFetch = (token?: string | null, overrideInit?: FetchInit) =>
            fetch(input, {
                ...(overrideInit ?? init),
                headers: makeHeaders(token, init?.headers),
                credentials: init?.credentials ?? 'include',
            })

        const accessToken = getToken()
        const res = await doFetch(accessToken)
        if (res.status !== 401) return res
        if (init?._retry) return res
        

        const refreshData = await refresh()
        if (!refreshData) {
            router.push('/auth')
            return res
        }
        
        const newToken = refreshData?.data?.accessToken
        if (!newToken) return res

        saveToken(newToken)
        const retryInit: FetchInit = { ...(init || {}), _retry: true }
        return doFetch(newToken, retryInit)
    }

    return { authFetch }
}
