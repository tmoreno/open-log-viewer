<template>
    <v-flex xs12>
        <span class="title">{{ severity }}</span>
        
        <v-divider></v-divider>

        <v-layout row wrap>
            <v-flex xs2>
                <v-layout column>
                    <span class="caption setting-header">{{ $t("text") }}</span>
                    <color-picker :color="textColorSelected" @accept="changeTextColor"></color-picker>
                </v-layout>
            </v-flex>

            <v-flex xs2>
                <v-layout column>
                    <span class="caption setting-header">{{ $t("background") }}</span>
                    <color-picker :color="backgroundColorSelected" @accept="changeBackgroundColor"></color-picker>
                </v-layout>
            </v-flex>

            <v-flex xs8>
                <v-layout column>
                    <span class="caption setting-header">{{ $t("regex") }}</span>
                    <v-text-field 
                        v-model="pattern" 
                        class="regex-input" 
                        hide-details 
                        @change="changePattern">
                    </v-text-field>
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
    const Utils = require("../utils");

	export default {
        components: {
			"color-picker": ColorPicker
		},
		props: [
            'severity',
            'setting'
        ],
        data() {
            return {
                textColorSelected: this.setting.textColor,
                backgroundColorSelected: this.setting.backgroundColor,
                pattern: this.setting.pattern
            }
        },
        watch: {
            setting: function (newValue) {
                this.textColorSelected = newValue.textColor;
                this.backgroundColorSelected = newValue.backgroundColor;
                this.pattern = newValue.pattern;
            }
        },
        methods: {
            changeTextColor(newColor) {
                this.textColorSelected = newColor;
                this.$emit('textColorChanged', {severity: this.severity, color: newColor});
            },
            changeBackgroundColor(newColor) {
                newColor = Utils.hexToRGBA(newColor, 0.9);
                this.backgroundColorSelected = newColor;
                this.$emit('backgroundColorChanged', {severity: this.severity, color: newColor});
            },
            changePattern() {
                this.$emit('patternChanged', {severity: this.severity, pattern: this.pattern});
            }
        }
	}
</script>
