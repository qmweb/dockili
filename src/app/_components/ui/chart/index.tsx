import clsx from "clsx"
import type React from "react"
import "./chart.scss"

// Chart Config Type
export type ChartConfig = {
	[key: string]: {
		label: string
		color?: string
	}
}

// Chart Container
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
	config: ChartConfig
}

const ChartContainer = ({ children, className, ...props }: ChartContainerProps) => {
	return (
		<div className={clsx("chart__container", className)} {...props}>
			{children}
		</div>
	)
}

// Chart Tooltip
interface ChartTooltipProps {
	cursor?: boolean
	content?: React.ComponentType<unknown>
}

const ChartTooltip = ({ cursor = true, content: Content }: ChartTooltipProps) => {
	return (
		<div className="chart__tooltip" data-cursor={cursor}>
			{Content && <Content />}
		</div>
	)
}

// Chart Tooltip Content
interface ChartTooltipContentProps {
	hideLabel?: boolean
	label?: string
	payload?: unknown[]
	active?: boolean
}

const ChartTooltipContent = ({
	hideLabel = false,
	label,
	payload,
	active,
}: ChartTooltipContentProps) => {
	if (!active || !payload || payload.length === 0) return null

	return (
		<div className="chart__tooltip__content">
			{!hideLabel && label && <div className="chart__tooltip__label">{label}</div>}
			<div className="chart__tooltip__items">
				{payload.map((entry, index) => (
					<div
						key={`${(entry as { name: string }).name}-${index}`}
						className="chart__tooltip__item"
					>
						<div
							className="chart__tooltip__indicator"
							style={{ backgroundColor: (entry as { color: string }).color }}
						/>
						<span className="chart__tooltip__value">
							{(entry as { value: number }).value?.toLocaleString() as string}
						</span>
						<span className="chart__tooltip__name">
							{(entry as { name: string }).name as string}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

export { ChartContainer, ChartTooltip, ChartTooltipContent }
