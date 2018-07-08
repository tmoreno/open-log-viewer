<template>
    <input type="file" @change="onFileChanged"/>
</template>

<script>
	export default {
		methods: {
			onFileChanged(event) {
                this.$emit('change', event);
            }
		}
	}
</script>