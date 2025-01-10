<template>
	<div :class="skeletonVariants({ variant, class: props.class })" />
</template>

<script setup lang="ts">
import { skeletonVariants } from '.'

interface Props {
	variant?: 'default' | 'card'
	class?: string
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'default',
})
</script>
