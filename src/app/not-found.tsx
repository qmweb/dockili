import type { Metadata } from "next"

import "./not-found.scss"

export const metadata: Metadata = {
	title: "Erreur 404",
	robots: {
		index: false,
		follow: false,
	},
}

export default function NotFound() {
	// redirect('/');
}
