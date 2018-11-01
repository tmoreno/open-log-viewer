<template>
    <v-app id="drag-and-drop-zone">
		<v-tabs show-arrows v-model="currentTab">
			<v-tab 
				v-for="(tab, i) in tabs" 
				:key="i" 
				:title="tab.filePath" 
				v-if="!tab.removed">

				{{ tab.fileName }}

				<v-btn flat icon @click.stop.prevent="closeTab(i)" v-show="showCloseButton()">
					<v-icon>close</v-icon>
				</v-btn>
		    </v-tab>

			<v-btn flat icon @click="newTab">
            	<v-icon>add</v-icon>
            </v-btn>
		</v-tabs>

		<v-tabs-items v-model="currentTab">
			<v-tab-item 
				v-for="(tab, i) in tabs" 
				:key="i" 
				v-if="!tab.removed">
				
				<file-chooser v-if="!tab.filePath" @change="onFileChanged($event, tab)" />
	
				<file-viewer v-if="tab.filePath" :file="tab.filePath" />
			</v-tab-item>
		</v-tabs-items>
    </v-app>
</template>

<script>
	const Tab = require("./tab");
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
				let tab = new Tab();

				tab.setFileName(file.name);
				tab.setFilePath(file.path);

				this.tabs.push(tab);
			});

			if (this.tabs.length === 0) {
				this.tabs.push(new Tab());
			}

			document.getElementById("drag-and-drop-zone").ondrop = (e) => {
            	e.preventDefault();

            	for (let file of e.dataTransfer.files) {
                	const selectedFileName = file.name;
					const selectedFilePath = file.path;

					let tab = new Tab();

					tab.setFileName(selectedFileName);
					tab.setFilePath(selectedFilePath);

					this.tabs.push(tab);

					this.currentTab = "" + (this.tabs.length - 1);

					userPreferences.addFile(selectedFileName, selectedFilePath);
            	}
            
            	return false;
        	};
		},
		methods: {
			newTab() {
				this.tabs.push(new Tab());

				this.currentTab = "" + (this.tabs.length - 1);
			},
			closeTab(index) {
				userPreferences.removeFile(this.tabs[index].filePath);

				this.tabs[index].removed = true;
			},
			showCloseButton() {
				const numOpenTabs = this.tabs.filter(tab => {
					return tab.removed === false;
				}).length;

				return numOpenTabs >= 2;
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