import type { NextConfig } from "next"

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

	turbopack: {
		rules: {
			"*.svg": {
				loaders: ["@svgr/webpack"],
				as: "*.js",
			},
		},
	},
}

module.exports = nextConfig
