"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format, formatDistanceToNow } from "date-fns"
import { ArrowUpDown, CalendarDays, HardDrive, Package, Tag } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Badge, Button, Checkbox, Table } from "@/app/_components/ui"
import type { Repository } from "@/utils/types/registry.interface"
import "./image-tags-table.scss"
import TagsActionBar from "./tags-action-bar"

interface TagWithDateAndSize {
	name: string
	date: Date
	isLatest: boolean
	size: number
	layers: number
	digest?: string
}

interface ManifestGroup {
	manifestDigest: string
	tags: TagWithDateAndSize[]
	size: number
	layers: number
	date: Date
}

interface ImageTagsTableProps {
	repository: Repository | undefined
	onSelectionChange?: (selectedTags: string[]) => void
	onDeleteTags?: (tags: string[]) => Promise<void>
	onRefresh?: () => void
}

// Utility function to format file sizes
const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return "0 B"

	const k = 1024
	const sizes = ["B", "KB", "MB", "GB", "TB"]
	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

const formatRelativeTime = (date: Date) => {
	const now = new Date()
	const diffInMs = now.getTime() - date.getTime()
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

	// If it's the day before yesterday or older, show the actual date
	if (diffInDays >= 2) {
		return format(date, "MMM d, yyyy")
	}

	// For recent dates (today and yesterday), use date-fns relative formatting
	return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true })
}

const getTagVariant = (tag: TagWithDateAndSize) => {
	if (tag.isLatest) return "primary"
	if (tag.name.includes("dev") || tag.name.includes("test")) return "warning"
	if (tag.name.includes("prod") || tag.name.includes("stable")) return "primary"
	return "default"
}

export default function ImageTagsTable({
	repository,
	onSelectionChange,
	onDeleteTags,
	onRefresh,
}: ImageTagsTableProps) {
	const [selectedTags, setSelectedTags] = useState<string[]>([])
	const [isDeleting, setIsDeleting] = useState(false)
	const [tagsWithDigests, setTagsWithDigests] = useState<{ tag: string; digest: string }[]>([])
	const [, setIsLoadingDigests] = useState(false)

	// Fetch manifest digests when repository changes
	useEffect(() => {
		const fetchDigests = async () => {
			if (!repository?.name || !repository?.tags?.length) return

			setIsLoadingDigests(true)
			try {
				const response = await fetch(
					`/api/registry/repositories/${encodeURIComponent(repository.name)}/tags`,
				)
				if (response.ok) {
					const data = await response.json()
					setTagsWithDigests(data.tagsWithDigests || [])
				} else {
					console.error("Failed to fetch manifest digests")
					setTagsWithDigests([])
				}
			} catch (error) {
				console.error("Error fetching manifest digests:", error)
				setTagsWithDigests([])
			} finally {
				setIsLoadingDigests(false)
			}
		}

		fetchDigests()
	}, [repository?.name, repository?.tags])

	// Process tags with date and size information, grouped by manifest digest
	const processedManifestGroups = useMemo((): ManifestGroup[] => {
		if (!repository?.tags || !repository?.tagsWithSize) return []

		// First, process individual tags with their digests
		const processedTags = repository.tags.map((tag) => {
			// Try to extract date from tag name (common patterns)
			let date = new Date()

			// Pattern 1: Readable date format (e.g., "Jul 13, 1502", "Sep 23, 2025")
			const readableDateMatch = tag.match(
				/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})/,
			)
			if (readableDateMatch) {
				const [, monthStr, day, year] = readableDateMatch
				const monthMap: { [key: string]: number } = {
					Jan: 0,
					Feb: 1,
					Mar: 2,
					Apr: 3,
					May: 4,
					Jun: 5,
					Jul: 6,
					Aug: 7,
					Sep: 8,
					Oct: 9,
					Nov: 10,
					Dec: 11,
				}
				const month = monthMap[monthStr]
				const parsedDate = new Date(parseInt(year, 10), month, parseInt(day, 10))

				// Validate that the date is reasonable (not too old or too far in the future)
				const currentYear = new Date().getFullYear()
				if (parsedDate.getFullYear() >= 1900 && parsedDate.getFullYear() <= currentYear + 10) {
					date = parsedDate
				}
			}
			// Pattern 2: YYYY-MM-DD or YYYYMMDD
			else {
				const dateMatch = tag.match(/(\d{4})-?(\d{2})-?(\d{2})/)
				if (dateMatch) {
					const [, year, month, day] = dateMatch
					const parsedDate = new Date(
						parseInt(year, 10),
						parseInt(month, 10) - 1,
						parseInt(day, 10),
					)

					// Validate that the date is reasonable
					const currentYear = new Date().getFullYear()
					if (parsedDate.getFullYear() >= 1900 && parsedDate.getFullYear() <= currentYear + 10) {
						date = parsedDate
					}
				}
				// Pattern 3: v1.2.3-20240101 or similar
				else {
					const versionDateMatch = tag.match(/(\d{8})/)
					if (versionDateMatch) {
						const dateStr = versionDateMatch[1]
						const year = dateStr.substring(0, 4)
						const month = dateStr.substring(4, 6)
						const day = dateStr.substring(6, 8)
						const parsedDate = new Date(
							parseInt(year, 10),
							parseInt(month, 10) - 1,
							parseInt(day, 10),
						)

						// Validate that the date is reasonable
						const currentYear = new Date().getFullYear()
						if (parsedDate.getFullYear() >= 1900 && parsedDate.getFullYear() <= currentYear + 10) {
							date = parsedDate
						}
					}
				}
			}

			// Find size information for this tag
			const tagWithSize = repository.tagsWithSize?.find((t) => t.name === tag)
			const size = tagWithSize?.size || 0
			const layers = tagWithSize?.layers || 0

			// Find the digest for this tag
			const tagWithDigest = tagsWithDigests.find((t) => t.tag === tag)
			const digest = tagWithDigest?.digest

			return {
				name: tag,
				date,
				isLatest: tag === "latest",
				size,
				layers,
				digest,
			}
		})

		// Group tags by manifest digest
		const manifestGroups = new Map<string, ManifestGroup>()

		processedTags.forEach((tag) => {
			const digest = tag.digest || "unknown"

			if (manifestGroups.has(digest)) {
				const group = manifestGroups.get(digest)!
				group.tags.push(tag)
				// Update date to the most recent one
				if (tag.date > group.date) {
					group.date = tag.date
				}
			} else {
				manifestGroups.set(digest, {
					manifestDigest: digest,
					tags: [tag],
					size: tag.size,
					layers: tag.layers,
					date: tag.date,
				})
			}
		})

		// Sort tags within each group: latest first, then alphabetically
		const sortedGroups = Array.from(manifestGroups.values()).map((group) => ({
			...group,
			tags: group.tags.sort((a, b) => {
				// Put 'latest' tag first
				if (a.isLatest && !b.isLatest) return -1
				if (!a.isLatest && b.isLatest) return 1
				// Then sort alphabetically
				return a.name.localeCompare(b.name)
			}),
		}))

		return sortedGroups
	}, [repository?.tags, repository?.tagsWithSize, tagsWithDigests])

	const handleSelectionChange = useCallback(
		(selectedRows: ManifestGroup[]) => {
			console.log("Selection changed:", selectedRows)
			const tagNames = selectedRows.flatMap((row) => row.tags.map((tag) => tag.name))
			setSelectedTags(tagNames)
			onSelectionChange?.(tagNames)
		},
		[onSelectionChange],
	)

	const handleClearSelection = useCallback(() => {
		setSelectedTags([])
		onSelectionChange?.([])
	}, [onSelectionChange])

	const handleDeleteTags = useCallback(
		async (tags: string[]) => {
			if (!onDeleteTags) return

			setIsDeleting(true)
			try {
				await onDeleteTags(tags)
				// Remove deleted tags from selection
				setSelectedTags((prev) => prev.filter((tag) => !tags.includes(tag)))
				onSelectionChange?.(selectedTags.filter((tag) => !tags.includes(tag)))

				// Refresh the table data after successful deletion
				if (onRefresh) {
					onRefresh()
				}
			} catch (error) {
				console.error("Failed to delete tags:", error)
				// You could add a toast notification here
			} finally {
				setIsDeleting(false)
			}
		},
		[onDeleteTags, selectedTags, onSelectionChange, onRefresh],
	)

	const columns: ColumnDef<ManifestGroup>[] = [
		{
			id: "select",
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected()
							? true
							: table.getIsSomePageRowsSelected()
								? "indeterminate"
								: false
					}
					onCheckedChange={(value) => {
						console.log("Header checkbox clicked:", value)
						table.toggleAllPageRowsSelected(!!value)
					}}
					aria-label="Select all"
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => {
						console.log(
							"Row checkbox clicked:",
							value,
							"for manifest:",
							row.original.manifestDigest,
						)
						row.toggleSelected(!!value)
					}}
					aria-label="Select row"
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: "tags",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="image-tags-table__sort-button"
				>
					<Tag className="image-tags-table__header__icon" size={16} />
					Tags
					<ArrowUpDown className="image-tags-table__sort-icon" size={14} />
				</Button>
			),
			cell: ({ row }) => (
				<div className="image-tags-table__tag-cell">
					<div className="image-tags-table__tags-container">
						{row.original.tags.map((tag) => (
							<Badge
								key={tag.name}
								variant={getTagVariant(tag)}
								className="image-tags-table__tag-badge"
							>
								{tag.name}
							</Badge>
						))}
					</div>
				</div>
			),
		},
		{
			accessorKey: "date",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="image-tags-table__sort-button"
				>
					<CalendarDays className="image-tags-table__header__icon" size={16} />
					Last Updated
					<ArrowUpDown className="image-tags-table__sort-icon" size={14} />
				</Button>
			),
			cell: ({ row }) => (
				<span className="image-tags-table__date">{formatRelativeTime(row.getValue("date"))}</span>
			),
		},
		{
			accessorKey: "size",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="image-tags-table__sort-button"
				>
					<HardDrive className="image-tags-table__header__icon" size={16} />
					Size
					<ArrowUpDown className="image-tags-table__sort-icon" size={14} />
				</Button>
			),
			cell: ({ row }) => <div>{formatFileSize(row.getValue("size"))}</div>,
		},
		{
			accessorKey: "layers",
			header: ({ column }) => (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="image-tags-table__sort-button"
				>
					<Package className="image-tags-table__header__icon" size={16} />
					Layers
					<ArrowUpDown className="image-tags-table__sort-icon" size={14} />
				</Button>
			),
			cell: ({ row }) => (
				<span className="image-tags-table__layers">
					{row.getValue("layers")} layer
					{(row.getValue("layers") as number) !== 1 ? "s" : ""}
				</span>
			),
		},
	]

	if (!repository) {
		return null
	}

	return (
		<div className="image-tags-table">
			<TagsActionBar
				selectedTags={selectedTags}
				onClearSelection={handleClearSelection}
				onDeleteTags={handleDeleteTags}
				isDeleting={isDeleting}
			/>
			<div className="image-tags-table__table-wrapper">
				<Table
					columns={columns}
					data={processedManifestGroups}
					enableSelection={true}
					onSelectionChange={handleSelectionChange}
					className="image-tags-table__table"
				/>
			</div>
		</div>
	)
}
