<template>
    <v-app id="drag-and-drop-zone">
		<v-tabs show-arrows v-model="currentTab" hide-slider>
			<v-tab v-for="(tab, i) in tabs" :key="tab.id" :title="tab.filePath" :href="'#tab' + tab.id">

				{{ tab.fileName }}

				<v-btn flat icon @click.stop.prevent="closeTab(i)" v-show="showCloseButton()">
					<v-icon>close</v-icon>
				</v-btn>
		    </v-tab>

			<v-btn flat icon color="grey darken-1" @click="newTab">
            	<v-icon>add</v-icon>
            </v-btn>
		</v-tabs>

		<v-tabs-items v-model="currentTab">
			<v-tab-item v-for="tab in tabs" :key="tab.id" :value="'tab' + tab.id" >
				<file-chooser v-if="!tab.filePath" @change="onFileChanged($event, tab)" />
	
				<file-viewer v-if="tab.filePath" :file="tab.filePath" />
			</v-tab-item>
		</v-tabs-items>
    </v-app>
</template>

<script>
	const Tab = require("./tab");
	const fs = __non_webpack_require__("fs");
	const UserPreferences = require("./userPreferences");
	const FileChooser = require("./components/FileChooser").default;
	const FileViewer = require("./components/FileViewer").default;

	let userPreferences = new UserPreferences();

	export default {
		components: {
			FileChooser, FileViewer
		},
		data() {
			return {
				tabs: [],
				currentTab: null
			}
		},
		mounted: function() {
			userPreferences.getFiles().forEach(file => {
				if (fs.existsSync(file.path)) {
					let tab = new Tab(file.name, file.path);

					this.tabs.push(tab);
				}
				else {
					userPreferences.removeFile(file.path);
				}
			});

			if (this.tabs.length === 0) {
				this.tabs.push(new Tab(this.$t("new-file")));
			}

			document.getElementById("drag-and-drop-zone").ondrop = (e) => {
            	e.preventDefault();

            	for (let file of e.dataTransfer.files) {
					let tab = new Tab(file.name, file.path);

					this.tabs.push(tab);

					this.currentTab = this.tabs.length - 1;

					userPreferences.addFile(file.name, file.path);
            	}
            
            	return false;
        	};
		},
		methods: {
			newTab() {
				this.tabs.push(new Tab(this.$t("new-file")));

				this.currentTab = this.tabs.length - 1;
			},
			closeTab(index) {
				userPreferences.removeFile(this.tabs[index].filePath);

				this.tabs.splice(index, 1);

				if (index <= this.currentTab) {
					this.currentTab--;

					if (this.currentTab < 0) {
						this.currentTab = 0;
					}
				}
			},
			showCloseButton() {
				return this.tabs.length > 1
			},
			onFileChanged(event, tab) {
				if (event.target.files.length > 0) {
					const selectedFileName = event.target.files[0].name;
					const selectedFilePath = event.target.files[0].path;

					tab.setFileName(selectedFileName);
					tab.setFilePath(selectedFilePath);

					userPreferences.addFile(selectedFileName, selectedFilePath);
				}
			}
		}
	}
</script>