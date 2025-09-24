import type { MetadataRoute } from "next"

export const revalidate = 14400 // 4 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return []
}
