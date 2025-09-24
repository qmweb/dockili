import clsx from "clsx"
import type React from "react"
import "./card.scss"

// Card
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
}

const Card = ({ children, className, ...props }: CardProps) => {
	return (
		<div className={clsx("card", className)} {...props}>
			{children}
		</div>
	)
}

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
}

const CardHeader = ({ children, className, ...props }: CardHeaderProps) => {
	return (
		<div className={clsx("card__header", className)} {...props}>
			{children}
		</div>
	)
}

// Card Title
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
	children: React.ReactNode
}

const CardTitle = ({ children, className, ...props }: CardTitleProps) => {
	return (
		<h3 className={clsx("card__title", className)} {...props}>
			{children}
		</h3>
	)
}

// Card Description
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode
}

const CardDescription = ({ children, className, ...props }: CardDescriptionProps) => {
	return (
		<p className={clsx("card__description", className)} {...props}>
			{children}
		</p>
	)
}

// Card Content
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
}

const CardContent = ({ children, className, ...props }: CardContentProps) => {
	return (
		<div className={clsx("card__content", className)} {...props}>
			{children}
		</div>
	)
}

// Card Footer
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
}

const CardFooter = ({ children, className, ...props }: CardFooterProps) => {
	return (
		<div className={clsx("card__footer", className)} {...props}>
			{children}
		</div>
	)
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
