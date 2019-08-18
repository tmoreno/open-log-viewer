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
	const SettingsDialog = require("./SettingsDialog").default;
	const UserPreferences = require("../userPreferences");
	const Utils = require("../utils");

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
		created: function() {
			this.applyLogSeverityStyles();
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
				
				const rules = {
					start: [
						{
							token: "debug", 
							regex: ".*" + Utils.escapeRegExp(this.currentFileSettings.debug.pattern) + ".*"
						},
						{
							token: "info", 
							regex: ".*" + Utils.escapeRegExp(this.currentFileSettings.info.pattern) + ".*"
						},
						{
							token: "warning", 
							regex: ".*" + Utils.escapeRegExp(this.currentFileSettings.warning.pattern) + ".*"
						},
						{
							token: "error", 
							regex: ".*" + Utils.escapeRegExp(this.currentFileSettings.error.pattern) + ".*"
						},
						{
							token: "fatal", 
							regex: ".*" + Utils.escapeRegExp(this.currentFileSettings.fatal.pattern) + ".*"
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

				this.applyLogSeverityStyles();
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
			handleResize() {
				this.height = this.calcHeight();
			},
			calcHeight() {
				return window.innerHeight - document.querySelector(".v-tabs__bar").offsetHeight - 40;
			},
			capitalizeFirstLetter(string) {
    			return string.charAt(0).toUpperCase() + string.slice(1);
			},
			applyLogSeverityStyles() {
				const logSeverityStyles = Array.from(document.styleSheets).find(styleSheet => styleSheet.title === "log-severity-styles");
			
				Array.from(logSeverityStyles.rules).forEach(rule => {
					const severity = rule.selectorText.replace(".ace_", "");
					const textColor = this.currentFileSettings[severity].textColor;

					let backgroundColor = this.currentFileSettings[severity].backgroundColor;
					// Convert to rgba to be compatible with 1.0.0 version
					if (backgroundColor.startsWith("#")) {
						backgroundColor = Utils.hexToRGBA(backgroundColor, 0.9);
					}

					rule.style.color = textColor;
					rule.style["background-color"] = backgroundColor;
				});
			}
		}
	}
</script>