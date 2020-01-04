<template>
    <div class="notification-one-time-challenge-complete">
        <div class="challenge-completed-title">
            <v-icon size="32" class="success-icon">{{$icons.mdiTrophyVariant}}</v-icon>
            <div>{{$t('pages:notifications.oneTime.challengeComplete.title')}}</div>
        </div>
        <img v-lazy="imageUrl" class="challenge-complete-image"/>
        <div class="description">{{$t('pages:notifications.oneTime.challengeComplete.description')}}</div>
        <div class="invite-friends-button">
            <v-btn color="primary" @click="showImportContactDialog = true">
                {{$t('pages:notifications.oneTime.challengeComplete.inviteFriendsButton')}}
            </v-btn>
        </div>
        <import-contact-dialog v-if="showImportContactDialog" @close-dialog="showImportContactDialog = false">
        </import-contact-dialog>
    </div>
</template>

<script>
    import ImportContactDialog from '~/components/import/ImportContactDialog';
    import {mdiTrophyVariant} from "@mdi/js";

    export default {
        props: ['notification'],
        components: {ImportContactDialog},
        data() {
            return {showImportContactDialog: false}
        },
        created() {
            this.$icons = {mdiTrophyVariant};
        },
        computed: {
            imageUrl() {
                return `${process.env.staticUrl}/img/notification/challengeComplete.jpg`;
            }
        }
    }
</script>

<style lang="scss">
    .notification-one-time-challenge-complete {
        font-weight: 300;

        .challenge-completed-title {
            display: flex;
            color: $success-text;
            font-weight: 400;
            font-size: 22px;
            margin-bottom: 18px;
            @include defaultPaddingCard();

            .success-icon {
                margin-right: 8px;
            }

            .success-icon.v-icon {
                color: $success-text;
            }
        }

        .challenge-complete-image {
            width: 100%;
        }

        .description {
            margin-top: 8px;
            font-weight: 300;
            font-size: 16px;
            @include defaultPaddingCard();
        }

        .invite-friends-button {
            margin-top: 16px;
            margin-left: 0;
            @include defaultPaddingCard();
        }
    }
</style>