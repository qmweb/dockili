"use server"

import { APIError } from "better-auth/api"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { auth } from "./auth"
import { db } from "./db"
import { user } from "./db/schema"

export async function signInAction(formData: FormData) {
	const email = formData.get("email") as string
	const password = formData.get("password") as string

	try {
		// With nextCookies plugin, cookies are automatically set
		const result = await auth.api.signInEmail({
			body: {
				email,
				password,
			},
		})

		if (!result.user) {
			redirect("/signin?error=invalid-credentials")
		}

		redirect("/dashboard")
	} catch (error) {
		// Check if this is a redirect error (which is expected)
		if (error instanceof Error && error.message === "NEXT_REDIRECT") {
			// Re-throw redirect errors so Next.js can handle them
			throw error
		}

		// Handle API errors
		if (error instanceof APIError) {
			console.log(error.message, error.status)
		}

		redirect("/signin?error=unexpected-error")
	}
}

export async function signUpAction(formData: FormData) {
	const email = formData.get("email") as string
	const password = formData.get("password") as string
	const confirmPassword = formData.get("confirmPassword") as string

	if (password !== confirmPassword) {
		redirect("/signup?error=password-mismatch")
	}

	try {
		// Check if any admin exists
		const adminExists = await db.select().from(user).where(eq(user.role, "admin")).limit(1)

		// If admin exists, prevent signup
		if (adminExists.length > 0) {
			redirect("/signup?error=registration-unavailable")
		}

		// With nextCookies plugin, cookies are automatically set
		const result = await auth.api.signUpEmail({
			body: {
				name: email.split("@")[0], // Use email prefix as name
				email,
				password,
				role: "admin", // First user becomes admin
			},
		})

		// Better Auth returns success if user is created, null if not
		if (!result.user) {
			redirect("/signup?error=account-creation-failed")
		}

		redirect("/dashboard")
	} catch (error) {
		// Check if this is a redirect error (which is expected)
		if (error instanceof Error && error.message === "NEXT_REDIRECT") {
			// Re-throw redirect errors so Next.js can handle them
			throw error
		}

		// Handle API errors
		if (error instanceof APIError) {
			console.log(error.message, error.status)
		}

		console.error("Signup error details:", error)
		redirect("/signup?error=unexpected-error")
	}
}

export async function signUp(email: string, password: string) {
	try {
		// Check if any admin exists
		const adminExists = await db.select().from(user).where(eq(user.role, "admin")).limit(1)

		// If admin exists, prevent signup
		if (adminExists.length > 0) {
			return { error: "Registration is not available" }
		}

		const result = await auth.api.signUpEmail({
			body: {
				name: email.split("@")[0], // Use email prefix as name
				email,
				password,
				role: "admin", // First user becomes admin
				callbackURL: "/dashboard",
			},
		})

		// Better Auth returns success if user is created, null if not
		if (!result.user) {
			return { error: "Failed to create account" }
		}

		return { success: true }
	} catch (error) {
		// Handle API errors
		if (error instanceof APIError) {
			console.log(error.message, error.status)
		}

		console.error("Signup error details:", error)
		return { error: "An unexpected error occurred" }
	}
}

export async function getSession() {
	try {
		const session = await auth.api.getSession({
			headers: new Headers(),
		})

		return session
	} catch {
		return null
	}
}

export async function checkAdminExists() {
	try {
		const adminExists = await db.select().from(user).where(eq(user.role, "admin")).limit(1)

		return adminExists.length > 0
	} catch {
		return false
	}
}
