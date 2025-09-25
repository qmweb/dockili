import { useId } from "react"

import Button from "@/app/_components/ui/button"
import Input from "@/app/_components/ui/input"
import { signInAction } from "@/utils/lib/auth-actions"

import "./signin.scss"

export default function SignInPage() {
	const emailId = useId()
	const passwordId = useId()

	return (
		<div className="signin">
			<div className="signin__container">
				<div className="signin__header">
					<h1 className="signin__header__title">Welcome back</h1>
					<p className="signin__header__subtitle">Sign in to your account</p>
				</div>

				<form className="signin__form" action={signInAction}>
					<div className="signin__form__field">
						<label htmlFor={emailId} className="signin__form__field__label">
							Email
						</label>
						<Input
							id={emailId}
							name="email"
							type="email"
							required
							placeholder="Enter your email"
							className="signin__form__field__input"
						/>
					</div>

					<div className="signin__form__field">
						<label htmlFor={passwordId} className="signin__form__field__label">
							Password
						</label>
						<Input
							id={passwordId}
							name="password"
							type="password"
							required
							placeholder="Enter your password"
							className="signin__form__field__input"
						/>
					</div>

					<Button type="submit" variant="primary" size="lg" className="signin__form__submit">
						Sign In
					</Button>
				</form>
			</div>
		</div>
	)
}
