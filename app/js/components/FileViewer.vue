<template>
	<div>
		<v-toolbar color="grey lighten-5 elevation-0" :height="toolbarHeight">
			<v-btn flat icon color="grey darken-1" @click="clean">
				<v-icon :title="$t('clean')" style="font-size: 24px">delete</v-icon>
			</v-btn>

			<v-divider class="mx-3" inset vertical></v-divider>

			<v-flex xs4>
        		<v-select multiple v-model="logLevelsSelected" :items="logLevels" @change="logLevelsToShowChanged"></v-select>
			</v-flex>

			<v-spacer></v-spacer>

			<v-divider class="mx-3" inset vertical></v-divider>

			<v-btn flat icon color="grey darken-1" @click="settings">
				<v-icon :title="$t('settings')" style="font-size: 24px">settings</v-icon>
			</v-btn>
		</v-toolbar>

		<settings-dialog 
			:show="showSettings"
			:settings="currentFileSettings"
			@accept="acceptSettings" 
			@close="closeSettings">
		</settings-dialog>

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
</style>

<script>
	const Tail = require("../tail");
	const Clusterize = require("clusterize.js");
	const SettingsDialog = require("./SettingsDialog").default;
	const UserPreferences = require("../userPreferences");

    let userPreferences = new UserPreferences();

	let tail;

	export default {
		components: {
			SettingsDialog
		},
		props: [
			'file',
			'fileSettings'
		],
		data() {
			return {
				clusterize: null,
				toolbarHeight: 40,
				logLevels: ["Debug", "Info", "Warning", "Error", "Fatal"],
				logLevelsSelected: this.getLogLevelsToShow(),
				height: this.calcHeight(),
				showDialog: false,
				showSettings: false,
				currentFileSettings: this.fileSettings
			}
		},
		mounted: function() {
			window.addEventListener('resize', this.handleResize);

			this.clusterize = new Clusterize({
				scrollElem: this.$refs.logLinesScroll,
				contentElem: this.$refs.logLinesContent,
				show_no_data_row: false
			});

			this.startTail();
		},
		beforeDestroy: function() {
			tail.stop();

			window.removeEventListener('resize', this.handleResize);
		},
		methods: {
			getLogLevelsToShow() {
				return this.fileSettings.getLogLevelsToShow().map(severity => this.capitalizeFirstLetter(severity));
			},
			logLevelsToShowChanged() {
				this.currentFileSettings.setLogLevelsToShow(this.logLevelsSelected);

				this.acceptSettings(this.currentFileSettings);
			},
			clean() {
				this.clusterize.clear();
			},
			settings() {
				this.showSettings = true;
			},
			acceptSettings(newSettings) {
				this.currentFileSettings = newSettings;

				userPreferences.saveFileSettings(this.file, newSettings);

				tail.stop();

				this.clean();
				this.startTail();
				this.closeSettings();
			},
			closeSettings() {
				this.showSettings = false;
			},
			startTail() {
				tail = new Tail(this.file, 1000);

				let previousLineSeveritySettings = this.currentFileSettings.defaultLogLevel();
					
				tail.on('readLines', lines => {
					let logLines = lines
					.map(line => {
						let severitySettings = this.currentFileSettings.getSeveritySettings(line);

						if (!severitySettings) {
							severitySettings = previousLineSeveritySettings;
						}
						else {
							previousLineSeveritySettings = severitySettings;
						}

						return {
							severitySettings: severitySettings,
							line: line
						};
					})
					.filter(line => line.severitySettings.show)
					.map(line => this.createLogLine(line.line, line.severitySettings));

					this.clusterize.append(logLines);
				});
				
				tail.start().catch(error => this.showDialog = true);
			},
			createLogLine(line, severitySettings) {
				let p = document.createElement("p");
				p.innerHTML = line;
				p.style.color = severitySettings.textColor;
				p.style.backgroundColor = severitySettings.backgroundColor;

				let temp = document.createElement("div");
				temp.appendChild(p);

				return temp.innerHTML;
			},
			handleResize() {
				this.height = this.calcHeight();
			},
			calcHeight() {
				return window.innerHeight - document.querySelector(".v-tabs__bar").offsetHeight - 40;
			},
			capitalizeFirstLetter(string) {
    			return string.charAt(0).toUpperCase() + string.slice(1);
			}
		}
	}
</script>