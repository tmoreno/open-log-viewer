<template>
	<v-container class="file-chooser-container" fill-height>
		<v-layout align-center justify-center column fill-height>
			<input type="file" ref="fileChooser" class="file-chooser" @change="onFileChanged"/>
			<img class="log-file-format" src="images/log-file-format.svg"/>
			<v-btn large color="info" @click="openFileChooser">{{ $t("choose-file") }}</v-btn>
		</v-layout>
	</v-container>
</template>

<style>
	.file-chooser-container {
		height: 88vh;
	}

	.file-chooser {
		position: absolute;
		left: 0;
		top: 0;
		opacity: 0;
	}

	img.log-file-format {
		width: 200px;
		height: 200px;
		display: block;
	}
</style>

<script>
	export default {
		methods: {
			onFileChanged(event) {
                this.$emit('change', event);
			},
			openFileChooser() {
				this.$refs.fileChooser.click();
			}
		}
	}
</script>