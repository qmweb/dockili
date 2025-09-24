"use client"

import { ShowMore as ShowMoreReactTruncate } from "@re-dev/react-truncate"
import clsx from "clsx"
import type React from "react"
import { useMediaQuery } from "react-responsive"
import "./show-more.scss"

interface ShowMoreProps {
	children: React.ReactNode
	lines?: number
	className?: string
	mediaQuery?: number
	variant?: "default" | "compact" | "expanded"
}

const ShowMore = ({
	children,
	lines = 3,
	className,
	mediaQuery,
	variant = "default",
	...props
}: ShowMoreProps) => {
	const isUnderMediaQuery = useMediaQuery({
		maxWidth: mediaQuery ?? 0,
	})

	const containerClassName = clsx("showMore", `showMore--${variant}`, className)

	return (
		<div className={containerClassName}>
			<ShowMoreReactTruncate
				lines={mediaQuery ? (isUnderMediaQuery ? lines : 0) : lines}
				className="content"
				{...props}
			>
				{children}
			</ShowMoreReactTruncate>
		</div>
	)
}

export default ShowMore
