"use client"

import { useRouter } from "next/navigation"
import { useEffect, useId, useState } from "react"

import Button from "@/app/_components/ui/button"
import Input from "@/app/_components/ui/input"
import { clientSignUp } from "@/utils/lib/auth-client"

import "./signup.scss"

export default function SignUpPage() {
	const emailId = useId()
	const passwordId = useId()
	const confirmPasswordId = useId()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [adminExists, setAdminExists] = useState<boolean | null>(null)

	// Check if admin already exists
	useEffect(() => {
		const checkAdmin = async () => {
			try {
				const response = await fetch("/api/auth/session")
				const data = await response.json()
				// If we get a session, admin exists
				setAdminExists(!!data.user)
			} catch {
				// If no session, we can proceed with signup
				setAdminExists(false)
			}
		}
		checkAdmin()
	}, [])

	// If admin exists, redirect to signin
	if (adminExists === true) {
		router.push("/signin")
		return null
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		const formData = new FormData(e.currentTarget)
		const email = formData.get("email") as string
		const password = formData.get("password") as string
		const confirmPassword = formData.get("confirmPassword") as string

		if (password !== confirmPassword) {
			setError("Passwords do not match")
			setIsLoading(false)
			return
		}

		try {
			const result = await clientSignUp.email({
				email,
				password,
				name: email.split("@")[0], // Use email prefix as name
				callbackURL: "/dashboard",
			})

			if (result.error) {
				setError(result.error.message || "Sign up failed")
			}
		} catch (err) {
			setError("An unexpected error occurred")
			console.error("Sign up error:", err)
		} finally {
			setIsLoading(false)
		}
	}

	// Show loading while checking admin status
	if (adminExists === null) {
		return (
			<div className="signup">
				<div className="signup__container">
					<div className="signup__header">
						<h1 className="signup__header__title">Loading...</h1>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="signup">
			<div className="signup__container">
				<div className="signup__header">
					<h1 className="signup__header__title">Create Admin Account</h1>
					<p className="signup__header__subtitle">Set up your admin account to get started</p>
				</div>

				{error && (
					<div className="signup__error">
						<p>{error}</p>
					</div>
				)}

				<form className="signup__form" onSubmit={handleSubmit}>
					<div className="signup__form__field">
						<label htmlFor={emailId} className="signup__form__field__label">
							Email
						</label>
						<Input
							id={emailId}
							name="email"
							type="email"
							required
							placeholder="Enter your email"
							className="signup__form__field__input"
						/>
					</div>

					<div className="signup__form__field">
						<label htmlFor={passwordId} className="signup__form__field__label">
							Password
						</label>
						<Input
							id={passwordId}
							name="password"
							type="password"
							required
							placeholder="Create a password"
							className="signup__form__field__input"
						/>
					</div>

					<div className="signup__form__field">
						<label htmlFor={confirmPasswordId} className="signup__form__field__label">
							Confirm Password
						</label>
						<Input
							id={confirmPasswordId}
							name="confirmPassword"
							type="password"
							required
							placeholder="Confirm your password"
							className="signup__form__field__input"
						/>
					</div>

					<Button
						type="submit"
						variant="primary"
						size="lg"
						className="signup__form__submit"
						disabled={isLoading}
					>
						{isLoading ? "Creating Account..." : "Create Admin Account"}
					</Button>
				</form>
			</div>
		</div>
	)
}
