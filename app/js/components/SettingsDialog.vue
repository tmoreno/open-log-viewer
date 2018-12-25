<template>
    <v-layout row justify-center>
        <v-dialog persistent max-width="600px" v-model="showDialog">
            <v-card>
                <v-card-title>
                    <span class="headline">
                        {{ $t("settings") }}
                    </span>
                </v-card-title>

                <v-card-text>
                    <v-container grid-list-md style="padding: 0">
                        <v-layout row wrap>
                            <log-severity-setting 
                                severity="DEBUG" 
                                :textColor="debugTextColor" 
                                :backgroundColor="debugBackgroundColor"
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler">
                            </log-severity-setting>

                            <log-severity-setting 
                                severity="INFO"
                                :textColor="infoTextColor" 
                                :backgroundColor="infoBackgroundColor"
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler">
                            </log-severity-setting>

                            <log-severity-setting 
                                severity="WARNING"
                                :textColor="warningTextColor" 
                                :backgroundColor="warningBackgroundColor"
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler">
                            </log-severity-setting>

                            <log-severity-setting 
                                severity="ERROR"
                                :textColor="errorTextColor" 
                                :backgroundColor="errorBackgroundColor"
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler">
                            </log-severity-setting>

                            <log-severity-setting 
                                severity="FATAL"
                                :textColor="fatalTextColor" 
                                :backgroundColor="fatalBackgroundColor"
                                @textColorChanged="textColorChangedHandler"
                                @backgroundColorChanged="backgroundColorChangedHandler">
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
			'show'
        ],
        data() {
            return {
                showDialog: this.show,
                debugTextColor: "#ffffff",
                debugBackgroundColor: "#000000",
                infoTextColor: "#ffffff",
                infoBackgroundColor: "#000000",
                warningTextColor: "#ffffff",
                warningBackgroundColor: "#000000",
                errorTextColor: "#ffffff",
                errorBackgroundColor: "#000000",
                fatalTextColor: "#ffffff",
                fatalBackgroundColor: "#000000"
            }
        },
        watch: {
            show: function (newValue) {
                this.showDialog = newValue;
            }
        },
        methods: {
            textColorChangedHandler(eventData) {
                switch(eventData.severity) {
                    case 'DEBUG':
                        this.debugTextColor = eventData.color;
                        break;

                    case 'INFO':
                        this.infoTextColor = eventData.color;
                        break;

                    case 'WARNING':
                        this.warningTextColor = eventData.color;
                        break;

                    case 'ERROR':
                        this.errorTextColor = eventData.color;
                        break;

                    case 'FATAL':
                        this.fatalTextColor = eventData.color;
                        break;
                }
            },
            backgroundColorChangedHandler(eventData) {
                switch(eventData.severity) {
                    case 'DEBUG':
                        this.debugBackgroundColor = eventData.color;
                        break;

                    case 'INFO':
                        this.infoBackgroundColor = eventData.color;
                        break;

                    case 'WARNING':
                        this.warningBackgroundColor = eventData.color;
                        break;

                    case 'ERROR':
                        this.errorBackgroundColor = eventData.color;
                        break;

                    case 'FATAL':
                        this.fatalBackgroundColor = eventData.color;
                        break;
                }
            },
            close() {
                this.showDialog = false;
                this.$emit('close');
            },
            save() {
                this.close();
            }
        }
	}
</script>