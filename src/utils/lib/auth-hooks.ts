"use client"

import { useSession } from "./auth-client"

export function useAuth() {
	const { data: session, isPending } = useSession()

	return {
		user: session?.user || null,
		session: session?.session || null,
		isAuthenticated: !!session?.user,
		isLoading: isPending,
	}
}
