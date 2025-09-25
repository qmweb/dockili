import { redirect } from "next/navigation"
import { checkAdminExists } from "@/utils/lib/auth-actions"

export default async function RootPage() {
	// Check if admin exists
	const adminExists = await checkAdminExists()

	// If no admin exists, redirect to signup
	if (!adminExists) {
		redirect("/signup")
	}

	// If admin exists, redirect to dashboard
	redirect("/dashboard")
}
