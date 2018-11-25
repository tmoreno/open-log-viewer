<template>
    <div>
        <v-btn :color="selectedColorButton" @click="showDialog = true"></v-btn>

        <v-dialog v-model="showDialog" width="225">
            <v-card>
                <color-picker v-model="selectedColor"></color-picker>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn color="primary" @click="accept">
                        {{ $t("accept") }}
                    </v-btn>

                    <v-btn color="primary" flat @click="cancel">
                        {{ $t("cancel") }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { Chrome } from 'vue-color';

	export default {
        components: {
			"color-picker": Chrome
		},
		props: [
            'color'
        ],
        data() {
            return {
                showDialog: false,
                selectedColor: this.color,
                selectedColorButton: this.color
            }
        },
        methods: {
            accept() {
                this.selectedColorButton = this.selectedColor.hex;
                this.showDialog = false;
                this.$emit('accept', this.selectedColor.hex);
            },
            cancel() {
                this.selectedColor = this.color;
                this.showDialog = false;
            }
        }
	}
</script>