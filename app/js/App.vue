<template>
    <v-app>
		<v-tabs>
			<v-tab v-for="(tab, i) in tabs" :key="i">
				{{ tab.title }}

				<v-btn flat icon @click="closeTab(i)" v-show="tabs.length > 1">
					<v-icon>close</v-icon>
				</v-btn>
		    </v-tab>

			<v-btn flat icon @click="newTab">
              <v-icon>add</v-icon>
            </v-btn>

			<v-tabs-items>
				<v-tab-item>	
            		<input type="file" @change="onFileChanged"/>
        
					<div class="log-lines-container">
						<div id="log-lines" ref="logLines"></div>
					</div>
				</v-tab-item>
			</v-tabs-items>
		</v-tabs>
        
		<!--
		<div class="header-container">
            <input type="file" @change="onFileChanged"/>
        </div>

        <div class="log-lines-container">
            <div id="log-lines" ref="logLines"></div>
        </div>
		-->
    </v-app>
</template>

<script>
	const FileViewer = require("./file-viewer");
	const Tail = require("./tail");
	const Tab = require("./tab");
	
	let tail;
	let fileViewer;

	export default {
		mounted: function() {
			fileViewer = new FileViewer(this.$refs.logLines);
		},
		data() {
			return {
				tabs: [new Tab()]
			}
		},
		methods: {
			newTab() {
				this.tabs.push(new Tab());
			},
			closeTab(index) {
				this.tabs = this.tabs.filter((tab, i) => {
					return i !== index;
				});
			},
			onFileChanged(event) {
				if (event.target.files.length > 0) {
					const selectedFilePath = event.target.files[0].path;
				
					fileViewer.clean();
				
					if (tail) {
						tail.stop();
					}
					
					tail = new Tail(selectedFilePath, 1000);
					
					tail.on('readLines', lines => {
						lines.forEach(line => {
		                	fileViewer.appendLine(line);
        			    });
					});
					
					tail.start();
				}
			}
		}
	}
</script>