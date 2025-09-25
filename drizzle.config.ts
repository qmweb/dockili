import { defineConfig } from "drizzle-kit"

export default defineConfig({
	schema: "./src/utils/lib/db/schema.ts",
	out: "./src/utils/lib/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
})
