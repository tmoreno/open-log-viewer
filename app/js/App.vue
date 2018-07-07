<template>
    <v-app>
		<v-tabs>
			<v-tab>
      			Nuevo archivo
				<v-btn flat icon>
					<v-icon>close</v-icon>
				</v-btn>
		    </v-tab>

			<v-btn flat icon>
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
	
	let tail;
	let fileViewer;

	export default {
		mounted: function() {
			fileViewer = new FileViewer(this.$refs.logLines);
		},
		methods: {
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