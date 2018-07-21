<template>
    <v-app>
		<v-tabs show-arrows v-model="currentTab">
			<v-tab 
				v-for="(tab, i) in tabs" 
				:key="i" 
				:href="'#tab' + i"
				:title="tab.filePath">

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
					:id="'tab' + i">
					
					<file-chooser 
						v-show="!tab.filePath" 
						@change="onFileChanged($event, tab)"/>
        
					<div class="log-lines-container">
						<div id="log-lines" ref="logLines"></div>
					</div>
				</v-tab-item>
			</v-tabs-items>
		</v-tabs>
    </v-app>
</template>

<script>
	const Tab = require("./tab");
	const Tail = require("./tail");
	const FileViewer = require("./file-viewer");
	const FileChooser = require("./components/FileChooser").default;
	
	let tail;

	export default {
		components: {
			FileChooser
		},
		data() {
			return {
				tabs: [new Tab()],
				currentTab: 'tab0'
			}
		},
		mounted: function() {
			let fileViewer = new FileViewer(this.$refs.logLines[0]);

			this.tabs[0].setFileViewer(fileViewer);
		},
		updated: function() {
			let numTabs = this.tabs.length;
			let fileViewer = new FileViewer(this.$refs.logLines[numTabs - 1]);

			this.tabs[numTabs - 1].setFileViewer(fileViewer);
		},
		methods: {
			newTab() {
				this.tabs.push(new Tab());
				this.currentTab = 'tab' + (this.tabs.length - 1);
			},
			closeTab(index) {
				this.tabs = this.tabs.filter((tab, i) => {
					return i !== index;
				});
			},
			onFileChanged(event, tab) {
				if (event.target.files.length > 0) {
					const selectedFilePath = event.target.files[0].path;

					tab.setFileName(event.target.files[0].name);
					tab.setFilePath(selectedFilePath);
				
					tab.clean();
				
					if (tail) {
						tail.stop();
					}
					
					tail = new Tail(selectedFilePath, 1000);
					
					tail.on('readLines', lines => {
						lines.forEach(line => {
		                	tab.appendLine(line);
        			    });
					});
					
					tail.start();
				}
			}
		}
	}
</script>