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

        <color-picker :show="showColorPicker" :color="color" @cancel="showColorPicker = false"></color-picker>
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
                color: "#194d33",
                showColorPicker: false
            }
        }
	}
</script>
