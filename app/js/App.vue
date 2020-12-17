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
	
				<file-viewer 
					ref="fileViewer" 
					v-if="tab.filePath" 
					:file="tab.filePath" 
					:file-settings="tab.fileSettings"
					:global-settings="globalSettings"
					@settingsButtonClicked="settingsButtonClicked" />
			</v-tab-item>
		</v-tabs-items>

		<settings-dialog 
			:show="showSettings"
			:settings="globalSettings"
			@accept="acceptSettings" 
			@close="closeSettings">
		</settings-dialog>
    </v-app>
</template>

<script>
	const _ = require('lodash');
	const Tab = require("./tab");
	const app = window.electron.app;
	const remote = window.electron.remote;
	const fs = window.node.fs;
	const FileSettings = require("./fileSettings");
	const UserPreferences = require("./userPreferences");
	const OpenNewFileCommand = require("./commands/openNewFileCommand");
	const AceEditor = require("./aceEditor");
	const Utils = require("./utils");
	const FileChooser = require("./components/FileChooser").default;
	const FileViewer = require("./components/FileViewer").default;
	const SettingsDialog = require("./components/SettingsDialog").default;

	let userPreferences = new UserPreferences();

	export default {
		components: {
			FileChooser, 
			FileViewer, 
			SettingsDialog
		},
		data() {
			return {
				tabs: [],
				currentTab: null,
				showSettings: false,
				globalSettings: userPreferences.getGlobalSettings()
			}
		},
		created: function() {
			AceEditor.init(this.globalSettings);
			this.changeLogSeverityStyles();
		},
		mounted: function() {
			userPreferences.getFiles().forEach(file => {
				if (fs.existsSync(file.path)) {
					let tab = new Tab(file.name, file.path, FileSettings.createFromSettings(file.settings));

					this.tabs.push(tab);
				}
				else {
					userPreferences.removeFile(file.path);
				}
			});

			if (remote.getGlobal('arguments').file) {
				new OpenNewFileCommand(
					remote.getGlobal('arguments').file, 
					this.tabs, 
					userPreferences
				)
				.execute();
			}
			
			if (this.tabs.length === 0) {
				this.tabs.push(new Tab(this.$t("new-file")));
			}

			document.getElementById("drag-and-drop-zone").ondrop = (e) => {
            	e.preventDefault();

            	for (let file of e.dataTransfer.files) {
					let fileSettings = new FileSettings();
					let tab = new Tab(file.name, file.path, fileSettings);

					this.tabs.push(tab);

					userPreferences.addFile(file.name, file.path, fileSettings);
            	}
            
            	return false;
			};
		},
		methods: {
			newTab() {
				this.tabs.push(new Tab(this.$t("new-file")));
			},
			closeTab(index) {
				userPreferences.removeFile(this.tabs[index].filePath);

				this.tabs.splice(index, 1);
			},
			showCloseButton() {
				return this.tabs.length > 1
			},
			onFileChanged(event, tab) {
				if (event.target.files.length > 0) {
					const selectedFileName = event.target.files[0].name;
					const selectedFilePath = event.target.files[0].path;
					const fileSettings = new FileSettings();

					tab.setFileName(selectedFileName);
					tab.setFilePath(selectedFilePath);
					tab.setFileSettings(fileSettings);

					userPreferences.addFile(selectedFileName, selectedFilePath, fileSettings);
				}
			},
			settingsButtonClicked() {
				this.showSettings = true;
			},
			closeSettings() {
				this.showSettings = false;
			},
			acceptSettings(eventData) {
				this.globalSettings = _.merge(this.globalSettings, eventData.newSettings);

				userPreferences.saveGlobalSettings(this.globalSettings);

				this.closeSettings();
				this.changeLogSeverityStyles();
				this.changeFontSize(eventData.newSettings.fontSize);

				if (eventData.relaunch) {
					app.relaunch();
					app.exit();
				}
			},
			changeLogSeverityStyles() {
				const logSeverityStyles = Array.from(document.styleSheets).find(styleSheet => styleSheet.title === "log-severity-styles");
			
				Array.from(logSeverityStyles.rules).forEach(rule => {
					const severity = rule.selectorText.replace(".ace_", "");
					const textColor = this.globalSettings[severity].textColor;

					let backgroundColor = this.globalSettings[severity].backgroundColor;
					// Convert to rgba to be compatible with 1.0.0 version
					if (backgroundColor.startsWith("#")) {
						backgroundColor = Utils.hexToRGBA(backgroundColor, 0.9);
					}

					rule.style.color = textColor;
					rule.style["background-color"] = backgroundColor;
				});
			},
			changeFontSize(fontSize) {
				if (fontSize) {
					this.$refs.fileViewer.forEach(fileViewer => {
						fileViewer.changeFontSize(fontSize);
					});
				}
			}
		}
	}
</script>