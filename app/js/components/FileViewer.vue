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
	const ace = require("ace-builds/src-noconflict/ace.js");
	require("ace-builds/src-noconflict/ext-searchbox.js");
	const UserPreferences = require("../userPreferences");
	const Utils = require("../utils");

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

			ace.define('ace/mode/log_file', (require, exports, module) => {
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

			ace.define('ace/mode/log_file_highlight_rules', (require, exports, module) => {
				const oop = require("ace/lib/oop");
				const TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;
				
				let currentToken = "info";
				const rules = {
					start: [
						{
							token: function() {
								currentToken = "debug";
								return currentToken;
							},
							regex: ".*" + Utils.escapeRegExp(this.globalSettings.debug.pattern) + ".*"
						},
						{
							token: function() {
								currentToken = "info";
								return currentToken;
							},
							regex: ".*" + Utils.escapeRegExp(this.globalSettings.info.pattern) + ".*"
						},
						{
							token: function() {
								currentToken = "warning";
								return currentToken;
							},
							regex: ".*" + Utils.escapeRegExp(this.globalSettings.warning.pattern) + ".*"
						},
						{
							token: function() {
								currentToken = "error";
								return currentToken;
							},
							regex: ".*" + Utils.escapeRegExp(this.globalSettings.error.pattern) + ".*"
						},
						{
							token: function() {
								currentToken = "fatal";
								return currentToken;
							},
							regex: ".*" + Utils.escapeRegExp(this.globalSettings.fatal.pattern) + ".*"
						},
						{
							token: function() {
								return currentToken;
							},
							regex: "^.*$"
						}
					]
				};

				const LogFileHighlightRules = function() {
					this.$rules = rules;
				}

				oop.inherits(LogFileHighlightRules, TextHighlightRules);

				exports.LogFileHighlightRules = LogFileHighlightRules;
			});

			this.viewer = ace.edit(this.$refs.viewer);
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
			defaultLogLevel() {
        		return this.globalSettings.info;
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