"use client"

import type { Metadata } from "next"

import "./error.scss"

export const metadata: Metadata = {
	title: "Erreur",
	robots: {
		index: false,
		follow: false,
	},
}

export default function Error() {
	// redirect('/');
}
