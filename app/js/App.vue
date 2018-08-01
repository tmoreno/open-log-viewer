<template>
    <v-app>
		<v-tabs show-arrows v-model="currentTab">
			<v-tab 
				v-for="(tab, i) in tabs" 
				:key="i" 
				:href="'#tab' + i"
				:title="tab.filePath" 
				v-if="!tab.removed">

				{{ tab.fileName }}

				<v-btn flat icon @click="closeTab(i)" v-show="tabs.length > 1">
					<v-icon>close</v-icon>
				</v-btn>
		    </v-tab>

			<v-btn flat icon @click="newTab">
            	<v-icon>add</v-icon>
            </v-btn>

			<v-tabs-items>
				<v-tab-item 
					v-for="(tab, i) in tabs" 
					:key="i" 
					:id="'tab' + i" 
					v-if="!tab.removed">
					
					<file-chooser v-if="!tab.filePath" @change="onFileChanged($event, tab)" />
        
					<file-viewer v-if="tab.filePath" :file="tab.filePath" />
				</v-tab-item>
			</v-tabs-items>
		</v-tabs>
    </v-app>
</template>

<script>
	const Tab = require("./tab");
	const FileChooser = require("./components/FileChooser").default;
	const FileViewer = require("./components/FileViewer").default;

	export default {
		components: {
			FileChooser, FileViewer
		},
		data() {
			return {
				tabs: [new Tab()],
				currentTab: 'tab0'
			}
		},
		methods: {
			newTab() {
				this.tabs.push(new Tab());
				this.currentTab = 'tab' + (this.tabs.length - 1);
			},
			closeTab(index) {
				this.tabs[index].removed = true;
			},
			onFileChanged(event, tab) {
				if (event.target.files.length > 0) {
					const selectedFilePath = event.target.files[0].path;

					tab.setFileName(event.target.files[0].name);
					tab.setFilePath(selectedFilePath);
				}
			}
		}
	}
</script>