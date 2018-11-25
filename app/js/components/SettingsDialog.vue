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
                            <v-flex xs12>
                                <span class="title">DEBUG</span>
                                
                                <v-divider></v-divider>

                                <v-layout row wrap>
                                    <v-flex xs2>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("text") }}</span>
                                            <v-btn></v-btn>
                                        </v-layout>
                                    </v-flex>

                                    <v-flex xs2>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("background") }}</span>
                                            <v-btn></v-btn>
                                        </v-layout>
                                    </v-flex>

                                    <v-flex xs8>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("regex") }}</span>
                                            <v-text-field class="regex-input" hide-details></v-text-field>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex xs12>
                                <span class="title">INFO</span>

                                <v-divider></v-divider>

                                <v-layout row wrap>
                                    <v-flex xs2>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("text") }}</span>
                                            <v-btn></v-btn>
                                        </v-layout>
                                    </v-flex>

                                    <v-flex xs2>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("background") }}</span>
                                            <v-btn></v-btn>
                                        </v-layout>
                                    </v-flex>

                                    <v-flex xs8>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("regex") }}</span>
                                            <v-text-field class="regex-input" hide-details></v-text-field>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex xs12>
                                <span class="title">WARNING</span>

                                <v-divider></v-divider>

                                <v-layout row wrap>
                                    <v-flex xs2>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("text") }}</span>
                                            <v-btn></v-btn>
                                        </v-layout>
                                    </v-flex>

                                    <v-flex xs2>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("background") }}</span>
                                            <v-btn></v-btn>
                                        </v-layout>
                                    </v-flex>

                                    <v-flex xs8>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("regex") }}</span>
                                            <v-text-field class="regex-input" hide-details></v-text-field>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex xs12>
                                <span class="title">ERROR</span>

                                <v-divider></v-divider>

                                <v-layout row wrap>
                                    <v-flex xs2>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("text") }}</span>
                                            <v-btn></v-btn>
                                        </v-layout>
                                    </v-flex>

                                    <v-flex xs2>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("background") }}</span>
                                            <v-btn></v-btn>
                                        </v-layout>
                                    </v-flex>

                                    <v-flex xs8>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("regex") }}</span>
                                            <v-text-field class="regex-input" hide-details></v-text-field>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-flex>

                            <v-flex xs12>
                                <span class="title">FATAL</span>

                                <v-divider></v-divider>
                                <v-layout row wrap>
                                    <v-flex xs2>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("text") }}</span>
                                            <v-btn></v-btn>
                                        </v-layout>
                                    </v-flex>

                                    <v-flex xs2>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("background") }}</span>
                                            <v-btn></v-btn>
                                        </v-layout>
                                    </v-flex>

                                    <v-flex xs8>
                                        <v-layout column>
                                            <span class="caption setting-header">{{ $t("regex") }}</span>
                                            <v-text-field class="regex-input" hide-details></v-text-field>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
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

<style>
    .setting-header {
        margin-left: 8px;
    }

    .regex-input {
        margin-left: 8px; 
        margin-top: 0;
    }
</style>

<script>
	export default {
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