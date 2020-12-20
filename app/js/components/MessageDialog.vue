<template>
    <v-dialog v-model="showDialog" max-width="500">
        <v-card>
            <v-card-title class="title" :class="severity">
                {{ title }}
            </v-card-title>

            <v-card-text class="font-weight-medium subheading">
                {{ message }}
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn color="primary" flat @click="close">
                    OK
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: [
            'show',
            'severity',
            'title',
            'message'
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
            }
        }
    }
</script>