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

			<v-btn flat icon color="grey darken-1" @click="settingsButtonClicked">
				<v-icon :title="$t('global-settings')" style="font-size: 24px">settings</v-icon>
			</v-btn>
		</v-toolbar>

		<div ref="viewer" :style="{'height': height + 'px'}"></div>

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

<script>
	const Tail = require("../tail");
	const AceEditor = require("../aceEditor");
	const UserPreferences = require("../userPreferences");

    let userPreferences = new UserPreferences();

	let tail;
	let viewer;

	export default {
		props: [
			'file',
			'fileSettings',
			'globalSettings'
		],
		data() {
			return {
				toolbarHeight: 40,
				logLevels: ["Debug", "Info", "Warning", "Error", "Fatal"],
				logLevelsSelected: this.getLogLevelsToShow(),
				height: this.calcHeight(),
				showDialog: false,
				currentFileSettings: this.fileSettings
			}
		},
		mounted: function() {
			window.addEventListener('resize', this.handleResize);

			this.viewer = AceEditor.createViewer(this.$refs.viewer, this.globalSettings);

			this.startTail();
		},
		beforeDestroy: function() {
			tail.stop();

			window.removeEventListener('resize', this.handleResize);
		},
		methods: {
			defaultLogLevel() {
        		return this.currentFileSettings.info;
			},
			getSeveritySettings(line) {
				if (line.includes(this.globalSettings.fatal.pattern)) {
					return this.currentFileSettings.fatal;
				}
				else if (line.includes(this.globalSettings.error.pattern)) {
					return this.currentFileSettings.error;
				}
				else if (line.includes(this.globalSettings.warning.pattern)) {
					return this.currentFileSettings.warning;
				}
				else if (line.includes(this.globalSettings.info.pattern)) {
					return this.currentFileSettings.info;
				}
				else if (line.includes(this.globalSettings.debug.pattern)) {
					return this.currentFileSettings.debug;
				}
				else {
					return null;
				}
			},
			getLogLevelsToShow() {
				return this.fileSettings.getLogLevelsToShow().map(severity => this.capitalizeFirstLetter(severity));
			},
			logLevelsToShowChanged() {
				this.currentFileSettings.setLogLevelsToShow(this.logLevelsSelected);

				userPreferences.saveFileSettings(this.file, this.currentFileSettings);

				tail.stop();
				this.clean();
				this.startTail();
			},
			clean() {
				this.viewer.setValue("");
			},
			changeFontSize(fontSize) {
				this.viewer.setFontSize(fontSize + "px");
			},
			settingsButtonClicked() {
				this.$emit('settingsButtonClicked');
			},
			startTail() {
				tail = new Tail(this.file, 1000);

				let previousLineSeveritySettings = this.defaultLogLevel();
					
				tail.on('readLines', lines => {
					let logLines = lines
					.map(line => {
						let severitySettings = this.getSeveritySettings(line);

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
					.map(line => {
						// Ace editor not insert empty lines, and we want all lines
						// to a better layout
						if (line.line === "") {
							line.line = " ";
						}

						return this.viewer.insert(line.line + "\n");
					});
				});
				
				tail.start().catch(error => this.showDialog = true);
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