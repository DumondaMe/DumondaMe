<template>
    <v-card id="dialog-remove-admin-commitment">
        <div>
            <div id="dumonda-me-dialog-header">
                {{$t('pages:detailCommitment.adminDialog.titleRemoveAdmin', getTitle())}}
            </div>
            <v-divider></v-divider>
        </div>
        <v-card-text class="mobile-dialog-content">

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click.native="$emit('close-dialog')">
                {{$t("common:button.abort")}}
            </v-btn>
            <v-btn color="primary" @click.native="sendRemoveFromCommitmentRequest()"
                   :loading="loadingRunning">
                <v-icon left>mdi-account-minus</v-icon>
                {{$t("pages:detailCommitment.adminDialog.removeAdminButton")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        props: ['commitmentId', 'userId'],
        data() {
            return {loadingRunning: false}
        },
        methods: {
            getTitle() {
                return JSON.parse(JSON.stringify({commitment: this.$store.getters['commitment/getCommitment'].title}));
            },
            async sendRemoveFromCommitmentRequest() {
                try {
                    this.loadingRunning = true;
                    await this.$store.dispatch('commitment/removeAdmin', this.userId);
                    this.$emit('close-dialog');
                } finally {
                    this.loadingRunning = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #dialog-remove-admin-commitment {
        max-width: 650px;


    }
</style>
