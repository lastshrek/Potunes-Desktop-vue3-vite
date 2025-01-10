import { type VariantProps, cva } from 'class-variance-authority'

export { default as Skeleton } from './Skeleton.vue'

export const skeletonVariants = cva('animate-pulse rounded-md bg-[#282828]', {
	variants: {
		variant: {
			default: 'bg-[#282828]',
			card: 'bg-[#181818]',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export type SkeletonVariants = VariantProps<typeof skeletonVariants>
