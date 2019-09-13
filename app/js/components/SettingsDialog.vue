<template>
    <v-layout row justify-center>
        <v-dialog persistent max-width="600px" v-model="showDialog">
            <v-card>
                <v-card-title>
                    <span class="headline">
                        {{ $t("global-settings") }}
                    </span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md style="padding: 0">
                        <v-layout row wrap>
                            <v-flex xs4>
                                <v-text-field
                                    ref="fontSize"
                                    :label="$t('font-size')"
                                    v-model="fontSize"
                                    suffix="px"
                                    type="number"
                                    min="8"
                                    max="30"
                                    :rules="[rules.required, rules.min, rules.max]"
                                    @change="fontSizeChanged">
                                </v-text-field>
                            </v-flex>
                        </v-layout>

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

                    <v-btn color="primary" :disabled="isDisabledSaveButton" @click="saveClicked">
                        {{ $t("save") }}
                    </v-btn>

                    <v-btn color="primary" flat @click="close">
                        {{ $t("close") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog persistent v-model="showRestartAppDialog" max-width="620px">
            <v-card>
                <v-card-title class="title yellow lighten-2" primary-title>
        ️           ⚠️ {{ $t("warning") }}
                </v-card-title>

                <v-card-text>
                    {{ $t("patternChangedRestartAppWarning") }}
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="yesRestartAppClicked">
                        OK
                    </v-btn>

                    <v-btn color="primary" flat @click="noRestartAppClicked">
                        NO
                    </v-btn>

                    <v-btn color="primary" flat @click="cancelRestartAppClicked">
                        {{ $t("cancel") }}
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
                showRestartAppDialog: false,
                isDisabledSaveButton: false,
                fontSize: this.settings.fontSize,
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
                },
                rules: {
                    required: value => !!value || this.$t('required'),
                    min: value => value >= 8 || this.$t('min-font-size'),
                    max: value => value <= 30 || this.$t('max-font-size')
                }
            }
        },
        watch: {
            show: function (newValue) {
                this.showDialog = newValue;

                if (this.showDialog) {
                    this.isDisabledSaveButton = false;
                    this.showRestartAppDialog = false;
                    
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
            fontSizeChanged() {
                if (this.$refs.fontSize.valid) {
                    this.isDisabledSaveButton = false;
                }
                else {
                    this.isDisabledSaveButton = true;
                }
            },
            close() {
                this.showDialog = false;

                this.fontSize = this.settings.fontSize;
                this.settingsDebug = Object.assign({}, this.settings.debug);
                this.settingsInfo = Object.assign({}, this.settings.info);
                this.settingsWarning = Object.assign({}, this.settings.warning);
                this.settingsError = Object.assign({}, this.settings.error);
                this.settingsFatal = Object.assign({}, this.settings.fatal);

                this.$emit('close');
            },
            saveClicked() {
                if (this.isAnyPatternChanged()) {
                    this.showRestartAppDialog = true;
                }
                else {
                    this.save(false);
                }
            },
            save(relaunch) {
                this.showDialog = false;
    
                if (this.fontSize !== this.settings.fontSize) {
                    this.changes.fontSize = this.fontSize;
                }

                this.$emit('accept', {newSettings: this.changes, relaunch: relaunch});
            },
            cancelRestartAppClicked() {
                this.showRestartAppDialog = false;
            },
            noRestartAppClicked() {
                this.showRestartAppDialog = false;

                this.save(false);
            },
            yesRestartAppClicked() {
                this.showRestartAppDialog = false;

                this.save(true);
            },
            isAnyPatternChanged() {
                return (this.changes.debug.pattern && this.changes.debug.pattern !== this.settings.debug.pattern) || 
                        (this.changes.info.pattern && this.changes.info.pattern !== this.settings.info.pattern) ||
                        (this.changes.warning.pattern && this.changes.warning.pattern !== this.settings.warning.pattern) ||
                        (this.changes.error.pattern && this.changes.error.pattern !== this.settings.error.pattern) || 
                        (this.changes.fatal.pattern && this.changes.fatal.pattern !== this.settings.fatal.pattern);
            }
        }
	}
</script>