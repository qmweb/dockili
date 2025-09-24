import { NextResponse } from "next/server"
import { registryService } from "@/features/registry/services"

export async function GET() {
	try {
		const repositories = await registryService.getRepositoriesWithTags()
		return NextResponse.json(repositories)
	} catch (error) {
		console.error("Registry API error:", error)
		const errorResponse = {
			error: "Failed to fetch repositories",
			message: error instanceof Error ? error.message : "Unknown error",
		}
		return NextResponse.json(errorResponse, { status: 500 })
	}
}
