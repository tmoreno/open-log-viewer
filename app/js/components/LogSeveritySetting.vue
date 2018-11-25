<template>
    <v-flex xs12>
        <span class="title">{{ severity }}</span>
        
        <v-divider></v-divider>

        <v-layout row wrap>
            <v-flex xs2>
                <v-layout column>
                    <span class="caption setting-header">{{ $t("text") }}</span>
                    <color-picker :color="textColor" @accept="changeTextColor"></color-picker>
                </v-layout>
            </v-flex>

            <v-flex xs2>
                <v-layout column>
                    <span class="caption setting-header">{{ $t("background") }}</span>
                    <color-picker :color="backgroundColor" @accept="changeBackgroundColor"></color-picker>
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
    const ColorPicker = require("./ColorPicker").default;

	export default {
        components: {
			"color-picker": ColorPicker
		},
		props: [
			'severity'
        ],
        data() {
            return {
                textColor: "#ffffff",
                backgroundColor: "#000000"
            }
        },
        methods: {
            changeTextColor(newColor) {
                this.textColor = newColor;
            },
            changeBackgroundColor(newColor) {
                this.backgroundColor = newColor;
            }
        }
	}
</script>
