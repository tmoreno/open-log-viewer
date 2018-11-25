<template>
    <v-flex xs12>
        <span class="title">{{ severity }}</span>
        
        <v-divider></v-divider>

        <v-layout row wrap>
            <v-flex xs2>
                <v-layout column>
                    <span class="caption setting-header">{{ $t("text") }}</span>
                    <v-btn @click="showColorPicker = true"></v-btn>
                </v-layout>
            </v-flex>

            <v-flex xs2>
                <v-layout column>
                    <span class="caption setting-header">{{ $t("background") }}</span>
                    <v-btn @click="showColorPicker = true"></v-btn>
                </v-layout>
            </v-flex>

            <v-flex xs8>
                <v-layout column>
                    <span class="caption setting-header">{{ $t("regex") }}</span>
                    <v-text-field class="regex-input" hide-details></v-text-field>
                </v-layout>
            </v-flex>
        </v-layout>

        <v-dialog v-model="showColorPicker" width="225">
            <v-card>
                <color-picker v-model="colors"></color-picker>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="showColorPicker = false">
                        {{ $t("accept") }}
                    </v-btn>

                    <v-btn color="primary" flat @click="showColorPicker = false">
                        {{ $t("cancel") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
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
    import { Chrome } from 'vue-color';

	export default {
        components: {
			"color-picker": Chrome
		},
		props: [
			'severity'
        ],
        data() {
            return {
                colors: "#194d33",
                showColorPicker: false
            }
        }
	}
</script>
