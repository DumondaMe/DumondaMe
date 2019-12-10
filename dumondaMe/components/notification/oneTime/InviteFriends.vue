<template>
    <div class="notification-one-time-invite-friends">
        <div class="invite-title">{{$t('pages:notifications.oneTime.inviteFriends.title')}}</div>
        <img v-lazy="imageUrl" class="welcome-image" @click="showImportContactDialog = true"/>
        <div class="description">{{$t('pages:notifications.oneTime.inviteFriends.description')}}</div>
        <div class="invite-friends-button">
            <v-btn color="primary" @click="showImportContactDialog = true">
                {{$t('pages:notifications.oneTime.inviteFriends.inviteFriendsButton')}}
            </v-btn>
        </div>
        <import-contact-dialog v-if="showImportContactDialog" @close-dialog="showImportContactDialog = false">
        </import-contact-dialog>
    </div>
</template>

<script>
    import ImportContactDialog from '~/components/import/ImportContactDialog';

    export default {
        props: ['notification'],
        components: {ImportContactDialog},
        data() {
            return {showImportContactDialog: false}
        },
        computed: {
            imageUrl() {
                return `${process.env.staticUrl}/img/notification/networkingImage.jpg`;
            }
        }
    }
</script>

<style lang="scss">
    .notification-one-time-invite-friends {

        .invite-title {
            color: $primary-color;
            font-weight: 400;
            font-size: 22px;
            margin-bottom: 14px;
            @include defaultPaddingCard();
        }

        .welcome-image {
            width: 100%;
            cursor: pointer;
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