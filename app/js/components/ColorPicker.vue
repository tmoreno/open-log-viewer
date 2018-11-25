<template>
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
</template>

<script>
    import { Chrome } from 'vue-color';

	export default {
        components: {
			"color-picker": Chrome
		},
		props: [
            'show',
            'color'
        ],
        watch: {
            show: function (newValue) {
                this.showDialog = newValue;
            }
        },
        data() {
            return {
                selectedColor: this.color,
                showDialog: this.show
            }
        },
        methods: {
            cancel() {
                this.showDialog = false;
                this.$emit('cancel');
            },
            accept() {
                this.cancel();
            }
        }
	}
</script>