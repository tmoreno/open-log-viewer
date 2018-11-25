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
                            <log-severity-setting severity="DEBUG"></log-severity-setting>

                            <log-severity-setting severity="INFO"></log-severity-setting>

                            <log-severity-setting severity="WARNING"></log-severity-setting>

                            <log-severity-setting severity="ERROR"></log-severity-setting>

                            <log-severity-setting severity="FATAL"></log-severity-setting>
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
                showDialog: this.show
            }
        },
        watch: {
            show: function (newValue) {
                this.showDialog = newValue;
            }
        },
        methods: {
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