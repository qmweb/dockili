export interface User {
	id: string
	email: string
	role: "admin" | "user"
	createdAt: Date
	updatedAt: Date
}

export interface Session {
	id: string
	userId: string
	expiresAt: Date
	createdAt: Date
	updatedAt: Date
}

export interface AuthState {
	user: User | null
	session: Session | null
}

export interface SignInCredentials {
	email: string
	password: string
}

export interface SignUpCredentials {
	email: string
	password: string
	confirmPassword: string
}
