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

		<div id="viewer" :style="{'height': height + 'px'}"></div>

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
	const ace = require("ace-builds/src-noconflict/ace.js");
	require("ace-builds/src-noconflict/ext-searchbox.js");
	const SettingsDialog = require("./SettingsDialog").default;
	const UserPreferences = require("../userPreferences");

    let userPreferences = new UserPreferences();

	let tail;
	let viewer;

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

			ace.define('ace/mode/log_file', function(require, exports, module) {
				const oop = require("ace/lib/oop");
				const TextMode = require("ace/mode/text").Mode;
				const LogFileHighlightRules = require("ace/mode/log_file_highlight_rules").LogFileHighlightRules;

				const Mode = function() {
					this.HighlightRules = LogFileHighlightRules;
				};

				oop.inherits(Mode, TextMode);

				(function() {
					// Extra logic goes here. (see below)
				}).call(Mode.prototype);

				exports.Mode = Mode;
			});

			ace.define('ace/mode/log_file_highlight_rules', function(require, exports, module) {
				const oop = require("ace/lib/oop");
				const TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

				const LogFileHighlightRules = function() {
					this.$rules = {
  						start: [
							{
								token: "debug", 
								regex: "^.*DEBUG.*$"
							},
							{
								token: "info", 
								regex: "^.*INFO.*$"
							},
							{
								token: "warning", 
								regex: "^.*WARN.*$"
							},
							{
								token: "error", 
								regex: "^.*ERROR.*$"
							},
							{
								token: "fatal", 
								regex: "^.*FATAL.*$"
							}
						]
					};
				}

				oop.inherits(LogFileHighlightRules, TextHighlightRules);

				exports.LogFileHighlightRules = LogFileHighlightRules;
			});

			this.viewer = ace.edit("viewer");
			this.viewer.getSession().setMode('ace/mode/log_file');
			this.viewer.setOptions({
				readOnly: true,
				highlightActiveLine: false,
				showPrintMargin: false,
				fontFamily: "Consolas, monaco, 'Courier New', Courier, monospace",
				fontSize: "15px"
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
				this.viewer.setValue("");
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
					.map(line => this.viewer.insert(line.line + "\n"));
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