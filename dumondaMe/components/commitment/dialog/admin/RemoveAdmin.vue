<template>
    <v-card id="dialog-remove-admin-commitment">
        <div>
            <div id="dumonda-me-dialog-header">
                {{$t('pages:detailCommitment.adminDialog.titleRemoveAdmin', getTitle())}}
            </div>
            <v-divider></v-divider>
        </div>
        <v-card-text class="mobile-dialog-content">
            <div v-if="!isLoggedInUser" v-html="$t('pages:detailCommitment.adminDialog.descriptionRemoveAdmin',
            {commitment: $store.getters['commitment/getCommitment'].title, admin: userName})"></div>
            <div v-else v-html="$t('pages:detailCommitment.adminDialog.descriptionRemoveLoggedInAdmin',
            {commitment: $store.getters['commitment/getCommitment'].title, admin: userName})">
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click.native="$emit('close-dialog')">
                {{$t("common:button.abort")}}
            </v-btn>
            <v-btn color="primary" @click.native="sendRemoveFromCommitmentRequest()"
                   :loading="loadingRunning">
                <v-icon left>{{$icons.mdiAccountMinus}}</v-icon>
                {{$t("pages:detailCommitment.adminDialog.removeAdminButton")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {mdiAccountMinus} from "@mdi/js";

    export default {
        props: ['commitmentId', 'userId', 'userName', 'isLoggedInUser'],
        data() {
            return {loadingRunning: false};
        },
        created() {
            this.$icons = {mdiAccountMinus};
        },
        methods: {
            getTitle() {
                return JSON.parse(JSON.stringify({commitment: this.$store.getters['commitment/getCommitment'].title}));
            },
            async sendRemoveFromCommitmentRequest() {
                try {
                    this.loadingRunning = true;
                    await this.$store.dispatch('commitment/removeAdmin', this.userId);
                    if (this.isLoggedInUser) {
                        this.$emit('close-dialog-complete');
                    } else {
                        this.$emit('close-dialog');
                    }
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

        .mobile-dialog-content {
            b {
                font-weight: 500;
                color: $primary-color;
            }
        }
    }
</style>
