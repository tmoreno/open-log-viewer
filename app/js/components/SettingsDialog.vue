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
                            <log-severity-setting 
                                severity="DEBUG" 
                                :setting="currentSettings.debug" 
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler"
                                @patternChanged="patternChangedHandler">
                            </log-severity-setting>

                            <log-severity-setting 
                                severity="INFO"
                                :setting="currentSettings.info" 
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler"
                                @patternChanged="patternChangedHandler">
                            </log-severity-setting>

                            <log-severity-setting 
                                severity="WARNING"
                                :setting="currentSettings.warning" 
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler"
                                @patternChanged="patternChangedHandler">
                            </log-severity-setting>

                            <log-severity-setting 
                                severity="ERROR"
                                :setting="currentSettings.error" 
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler"
                                @patternChanged="patternChangedHandler">
                            </log-severity-setting>

                            <log-severity-setting 
                                severity="FATAL"
                                :setting="currentSettings.fatal" 
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
                currentSettings: this.settings
            }
        },
        watch: {
            show: function (newValue) {
                this.showDialog = newValue;
            }
        },
        methods: {
            textColorChangedHandler(eventData) {
                this.currentSettings.changeTextColor(eventData.severity, eventData.color);
            },
            backgroundColorChangedHandler(eventData) {
                this.currentSettings.changeBackgroundColor(eventData.severity, eventData.color);
            },
            patternChangedHandler(eventData) {
                this.currentSettings.changePattern(eventData.severity, eventData.pattern);
            },
            close() {
                this.showDialog = false;
                this.$emit('close');
            },
            save() {
                this.showDialog = false;
                this.$emit('accept', this.currentSettings);
            }
        }
	}
</script>