<template>
    <div class="notification-admin-of-commitment-request">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-title" v-if="!notification.removed">
            <span class="bold user-name" @click="$router.push({name: 'user-userId-slug',
            params: {userId: notification.userId, slug: notification.userSlug}})">
                {{notification.userName}}</span>
            {{$t('pages:notifications.adminOfCommitmentRequest.notification1')}}
            <span class="bold" @click="$router.push({name: 'commitment-commitmentId-slug',
                     params: {commitmentId: notification.commitmentId, slug: notification.commitmentSlug}})">
                {{notification.commitmentTitle}}</span>
            {{$t('pages:notifications.adminOfCommitmentRequest.notification2')}}
        </div>
        <div class="commands-container" v-if="!notification.read">
            <v-btn color="success" @click="setAdminOfCommitment(true, 'requestAcceptToBeAdminRunning')"
                   :loading="requestAcceptToBeAdminRunning"
                   :disabled="requestAcceptToBeAdminRunning || requestDenyToBeAdminRunning">
                <v-icon left>$vuetify.icons.mdiCheck</v-icon>
                {{$t('common:button.accept')}}
            </v-btn>
            <v-btn color="error" @click="setAdminOfCommitment(false, 'requestDenyToBeAdminRunning')"
                   :loading="requestDenyToBeAdminRunning"
                   :disabled="requestAcceptToBeAdminRunning || requestDenyToBeAdminRunning">
                <v-icon>{{$icons.mdiClose}}</v-icon>
                {{$t('common:button.deny')}}
            </v-btn>
        </div>
        <div class="info-post-action" v-else>
            <div v-if="notification.confirmToBeAdmin" class="confirmed-to-be-admin">
                {{$t('pages:notifications.adminOfCommitmentRequest.confirmedToBeAdmin')}}
            </div>
            <div v-else class="denied-to-be-admin">
                {{$t('pages:notifications.adminOfCommitmentRequest.deniedToBeAdmin')}}
            </div>
        </div>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import {mdiClose} from "@mdi/js";

    export default {
        name: "AdminOfCommitmentRequest",
        props: ['notification'],
        data() {
            return {
                requestAcceptToBeAdminRunning: false, requestDenyToBeAdminRunning: false,
                showError: false
            }
        },
        created() {
            this.$icons = {mdiClose}
        },
        methods: {
            async setAdminOfCommitment(confirmToBeAdmin, requestRunning) {
                try {
                    this[requestRunning] = true;
                    await this.$axios.$post(`user/commitment/admin/confirmAdmin`,
                        {notificationId: this.notification.notificationId, confirmToBeAdmin});
                    this.$store.commit('notification/ADMIN_OF_COMMITMENT',
                        {notificationSetAsRead: this.notification, confirmToBeAdmin});
                } catch (error) {
                    this.showError = true;
                } finally {
                    this[requestRunning] = false;
                }
            }
        },
    }
</script>

<style lang="scss">
    .notification-admin-of-commitment-request {
        font-weight: 300;

        .notification-title {
            .bold {
                font-weight: 400;
                cursor: pointer;
                color: $primary-color;
            }

            .bold.user-name {
                color: $primary-text;
            }

            :hover.bold {
                text-decoration: underline;
            }
        }

        .commands-container {
            margin-top: 18px;

            button {
                margin-left: 0;
                margin-right: 16px;
            }
        }

        .info-post-action {
            margin-top: 12px;

            .confirmed-to-be-admin {
                color: $success-text;
            }

            .denied-to-be-admin{
                color: $warning;
            }
        }
    }
</style>