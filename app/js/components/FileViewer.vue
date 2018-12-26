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

		<settings-dialog :show="showSettings" @accept="acceptSettings" @close="closeSettings"></settings-dialog>

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
			'file'
		],
		data() {
			return {
				clusterize: null,
				toolbarHeight: 40,
				height: this.calcHeight(),
				showDialog: false,
				showSettings: false,
				debugTextColor: userPreferences.getDebugSeveritySettings().textColor,
                debugBackgroundColor: userPreferences.getDebugSeveritySettings().backgroundColor,
                infoTextColor: userPreferences.getInfoSeveritySettings().textColor,
                infoBackgroundColor: userPreferences.getInfoSeveritySettings().backgroundColor,
                warningTextColor: userPreferences.getWarningSeveritySettings().textColor,
                warningBackgroundColor: userPreferences.getWarningSeveritySettings().backgroundColor,
                errorTextColor: userPreferences.getErrorSeveritySettings().textColor,
                errorBackgroundColor: userPreferences.getErrorSeveritySettings().backgroundColor,
                fatalTextColor: userPreferences.getFatalSeveritySettings().textColor,
                fatalBackgroundColor: userPreferences.getFatalSeveritySettings().backgroundColor
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
			clean() {
				this.clusterize.clear();
			},
			settings() {
				this.showSettings = true;
			},
			acceptSettings() {
				this.debugTextColor = userPreferences.getDebugSeveritySettings().textColor;
                this.debugBackgroundColor = userPreferences.getDebugSeveritySettings().backgroundColor;
                this.infoTextColor = userPreferences.getInfoSeveritySettings().textColor;
                this.infoBackgroundColor = userPreferences.getInfoSeveritySettings().backgroundColor;
                this.warningTextColor = userPreferences.getWarningSeveritySettings().textColor;
                this.warningBackgroundColor = userPreferences.getWarningSeveritySettings().backgroundColor;
                this.errorTextColor = userPreferences.getErrorSeveritySettings().textColor;
                this.errorBackgroundColor = userPreferences.getErrorSeveritySettings().backgroundColor;
                this.fatalTextColor = userPreferences.getFatalSeveritySettings().textColor;
				this.fatalBackgroundColor = userPreferences.getFatalSeveritySettings().backgroundColor;

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
					
				tail.on('readLines', lines => {
					let logLines = lines.map(line => {
						return this.createLogLine(line);
					});

					this.clusterize.append(logLines);
				});
				
				tail.start().catch(error => this.showDialog = true);
			},
			createLogLine(line) {
				let p = document.createElement("p");
				p.innerHTML = line;
				
				this.applyColor(p);

				let temp = document.createElement("div");
				temp.appendChild(p);

				return temp.innerHTML;
			},
			applyColor(line) {
				if (line.textContent.includes("FATAL")) {
					line.style.color = this.fatalTextColor;
					line.style.backgroundColor = this.fatalBackgroundColor;
				}
				else if (line.textContent.includes("ERROR")) {
					line.style.color = this.errorTextColor;
					line.style.backgroundColor = this.errorBackgroundColor;
				}
				else if (line.textContent.includes("WARN")) {
					line.style.color = this.warningTextColor;
					line.style.backgroundColor = this.warningBackgroundColor;
				}
				else if (line.textContent.includes("INFO")) {
					line.style.color = this.infoTextColor;
					line.style.backgroundColor = this.infoBackgroundColor;
				}
				else if (line.textContent.includes("DEBUG")) {
					line.style.color = this.debugTextColor;
					line.style.backgroundColor = this.debugBackgroundColor;
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