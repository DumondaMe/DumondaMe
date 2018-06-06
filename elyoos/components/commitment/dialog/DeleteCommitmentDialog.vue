<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="400px">
            <v-card>
                <v-card-title>
                    {{$t("pages:detailCommitment.deleteDialog.title")}}
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                    <p v-html="$t('pages:detailCommitment.deleteDialog.description', {commitment: commitmentToDelete})"></p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')" :disabled="running">
                        {{$t("common:button.abort")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="deleteCommitment()"
                           :loading="running" :disabled="running">
                        {{$t("pages:detailCommitment.deleteDialog.deleteCommitmentButton")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    export default {
        props: ['commitment', 'commitmentId'],
        data() {
            return {dialog: true, running: false}
        },
        computed: {
            commitmentToDelete() {
                return `<span class="commitment-to-delete">${this.commitment}</span>`
            }
        },
        methods: {
            async deleteCommitment() {
                try {
                    this.running = true;
                    await this.$store.dispatch('commitment/deleteCommitment', this.commitmentId);
                    this.$emit('close-dialog');
                    this.$router.push({name: 'index'});
                } catch (error) {
                    this.running = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    .commitment-to-delete {
        color: $primary-color;
    }
</style>
