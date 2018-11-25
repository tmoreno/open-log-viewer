<template>
	<div>
		<v-toolbar color="grey lighten-5 elevation-0" :height="toolbarHeight">
			<v-btn flat icon color="grey darken-1" @click="clean">
				<v-icon :title="$t('clean')" style="font-size: 24px">delete</v-icon>
			</v-btn>

			<v-spacer></v-spacer>

			<v-btn flat icon color="grey darken-1" @click="settings">
				<v-icon :title="$t('settings')" style="font-size: 24px">settings</v-icon>
			</v-btn>
		</v-toolbar>

		<settings-dialog :show="showSettings" @close="showSettings = false"></settings-dialog>

		<div ref="logLinesScroll" class="clusterize-scroll" :style="{'max-height': height + 'px'}">
			<div ref="logLinesContent" class="clusterize-content"></div>
		</div>

		<v-dialog v-model="showDialog" max-width="500">
      		<v-card>
        		<v-card-title class="title error">
					{{ $t("warning") }}
				</v-card-title>

				<v-card-text class="font-weight-medium subheading">
					{{ $t("file-no-exists", {filename: file}) }}
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>

					<v-btn color="primary" flat @click="showDialog = false">
						OK
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<style>
	.clusterize-content {
		font-size: 15px;
		line-height: initial;
		display: inline-block;
	}

	.clusterize-content p {
		margin: 0;
		white-space: pre;
		font-family: Consolas, monaco, 'Courier New', Courier, monospace;
	}

	.error, .fatal {
		color: #721c24;
		background-color: #f8d7da;
		border-color: #f5c6cb;
	}

	.warning {
		color: #856404;
		background-color: #fff3cd;
		border-color: #ffeeba;
	}

	.debug {
		color: #155724;
		background-color: #d4edda;
		border-color: #c3e6cb;
	}
</style>

<script>
	const Tail = require("../tail");
	const Clusterize = require("clusterize.js");
	const SettingsDialog = require("./SettingsDialog").default;

	let tail;

	export default {
		components: {
			SettingsDialog
		},
		props: [
			'file'
		],
		data() {
			return {
				clusterize: null,
				toolbarHeight: 40,
				height: this.calcHeight(),
				showDialog: false,
				showSettings: false
			}
		},
		mounted: function() {
			this.clusterize = new Clusterize({
				scrollElem: this.$refs.logLinesScroll,
				contentElem: this.$refs.logLinesContent,
				show_no_data_row: false
			});

			window.addEventListener('resize', this.handleResize);

			tail = new Tail(this.file, 1000);
					
			tail.on('readLines', lines => {
				let logLines = lines.map(line => {
					return this.createLogLine(line);
				});

				this.clusterize.append(logLines);
			});
			
			tail.start().catch(error => this.showDialog = true);
		},
		beforeDestroy: function() {
			tail.stop();

			window.removeEventListener('resize', this.handleResize);
		},
		methods: {
			clean() {
				this.clusterize.clear();
			},
			settings() {
				this.showSettings = true;
			},
			createLogLine(line) {
				let p = document.createElement("p");
				p.innerHTML = line;
				
				this.applyClassColor(p);

				let temp = document.createElement("div");
				temp.appendChild(p);

				return temp.innerHTML;
			},
			applyClassColor(line) {
				if (line.textContent.includes("FATAL")) {
					line.classList.add("fatal");
				}
				else if (line.textContent.includes("ERROR")) {
					line.classList.add("error");
				}
				else if (line.textContent.includes("WARN")) {
					line.classList.add("warning");
				}
				else if (line.textContent.includes("DEBUG")) {
					line.classList.add("debug");
				}
			},
			handleResize() {
				this.height = this.calcHeight();
			},
			calcHeight() {
				return window.innerHeight - document.querySelector(".v-tabs__bar").offsetHeight - 40;
			}
		}
	}
</script>