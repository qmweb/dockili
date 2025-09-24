import type { NextConfig } from "next"

/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
const webpack = require("webpack")

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://umami.qmweb.fr;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self' data:;
  connect-src 'self' https://umami.qmweb.fr;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

const nextConfig: NextConfig = {
	eslint: {
		ignoreDuringBuilds: true,
		dirs: ["src"],
	},

	reactStrictMode: true,

	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [],
	},

	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value: cspHeader.replace(/\n/g, ""),
					},
				],
			},
		]
	},

	webpack(config, { dev }: { dev: boolean }) {
		// Grab the existing rule that handles SVG imports
		const fileLoaderRule = config.module.rules.find((rule: any) => rule.test?.test?.(".svg"))

		if (dev) {
			config.watchOptions = {
				poll: 1000, // Check for changes every second
				aggregateTimeout: 300, // Delay rebuild after the first change
			}
		}

		config.module.rules.push(
			// Reapply the existing rule, but only for svg imports ending in ?url
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/, // *.svg?url
			},
			// Convert all other *.svg imports to React components
			{
				test: /\.svg$/i,
				issuer: { not: /\.(css|scss|sass)$/ },
				resourceQuery: { not: /url/ }, // exclude if *.svg?url
				loader: "@svgr/webpack",
				options: {
					dimensions: false,
					titleProp: true,
				},
			},
		)

		if (process.env.NODE_ENV === "production") {
			config.plugins.push(new webpack.ProgressPlugin())
		}

		// Modify the file loader rule to ignore *.svg, since we have it handled now.
		fileLoaderRule.exclude = /\.svg$/i

		return config
	},
}

module.exports = nextConfig
