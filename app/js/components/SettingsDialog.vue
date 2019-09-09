<template>
    <v-layout row justify-center>
        <v-dialog persistent max-width="600px" v-model="showDialog">
            <v-card>
                <v-card-title>
                    <span class="headline">
                        {{ $t("global-settings") }}
                    </span>
                </v-card-title>

                <v-card-text>⚠️ {{ $t("global-settings-warning") }}</v-card-text>

                <v-card-text>
                    <v-container grid-list-md style="padding: 0">
                        <v-layout row wrap>
                            <log-severity-setting 
                                severity="DEBUG" 
                                :setting="settingsDebug" 
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler"
                                @patternChanged="patternChangedHandler">
                            </log-severity-setting>

                            <log-severity-setting 
                                severity="INFO"
                                :setting="settingsInfo" 
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler"
                                @patternChanged="patternChangedHandler">
                            </log-severity-setting>

                            <log-severity-setting 
                                severity="WARNING"
                                :setting="settingsWarning" 
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler"
                                @patternChanged="patternChangedHandler">
                            </log-severity-setting>

                            <log-severity-setting 
                                severity="ERROR"
                                :setting="settingsError" 
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler"
                                @patternChanged="patternChangedHandler">
                            </log-severity-setting>

                            <log-severity-setting 
                                severity="FATAL"
                                :setting="settingsFatal" 
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler"
                                @patternChanged="patternChangedHandler">
                            </log-severity-setting>
                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="save">
                        {{ $t("save") }}
                    </v-btn>

                    <v-btn color="primary" flat @click="close">
                        {{ $t("close") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    const LogSeveritySetting = require("./LogSeveritySetting").default;

	export default {
        components: {
			LogSeveritySetting
		},
		props: [
            'show',
            'settings'
        ],
        data() {
            return {
                showDialog: this.show,
                settingsDebug: this.settings.debug,
                settingsInfo: this.settings.info,
                settingsWarning: this.settings.warning,
                settingsError: this.settings.error,
                settingsFatal: this.settings.fatal,
                changes: {
                    debug: {},
                    info: {},
                    warning: {},
                    error: {},
                    fatal: {}
                }
            }
        },
        watch: {
            show: function (newValue) {
                this.showDialog = newValue;

                if (this.showDialog) {
                    this.changes = {
                        debug: {},
                        info: {},
                        warning: {},
                        error: {},
                        fatal: {}
                    };
                }
            }
        },
        methods: {
            textColorChangedHandler(eventData) {
                this.changes[eventData.severity.toLowerCase()].textColor = eventData.color;
            },
            backgroundColorChangedHandler(eventData) {
                this.changes[eventData.severity.toLowerCase()].backgroundColor = eventData.color;
            },
            patternChangedHandler(eventData) {
                this.changes[eventData.severity.toLowerCase()].pattern = eventData.pattern;
            },
            close() {
                this.showDialog = false;

                this.settingsDebug = Object.assign({}, this.settings.debug);
                this.settingsInfo = Object.assign({}, this.settings.info);
                this.settingsWarning = Object.assign({}, this.settings.warning);
                this.settingsError = Object.assign({}, this.settings.error);
                this.settingsFatal = Object.assign({}, this.settings.fatal);

                this.$emit('close');
            },
            save() {
                this.showDialog = false;
                this.$emit('accept', this.changes);
            }
        }
	}
</script>