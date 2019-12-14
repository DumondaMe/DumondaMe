<template>
    <div class="notification-one-time-challenge-create-commitment">
        <div class="challenge-title">{{$t('pages:notifications.oneTime.challengeCreateCommitment.title')}}</div>
        <img v-lazy="imageUrl" class="welcome-image"/>
        <div class="description">{{$t('pages:notifications.oneTime.challengeCreateCommitment.description')}}</div>
        <div class="go-to-notification-setting">
            <v-btn color="primary"
                   @click="showCreateCommitmentDialog = true">
                {{$t('pages:notifications.oneTime.challengeCreateCommitment.createCommitment')}}
            </v-btn>
        </div>
        <create-commitment-dialog v-if="showCreateCommitmentDialog"
                                  @close-dialog="showCreateCommitmentDialog = false">
        </create-commitment-dialog>
    </div>
</template>

<script>
    import CreateCommitmentDialog from '~/components/commitment/dialog/CreateDialog.vue'

    export default {
        props: ['notification'],
        components: {CreateCommitmentDialog},
        data() {
            return {showCreateCommitmentDialog: false}
        },
        computed: {
            imageUrl() {
                return `${process.env.staticUrl}/img/notification/commitment.jpg`;
            }
        }
    }
</script>

<style lang="scss">
    .notification-one-time-challenge-create-commitment{
        font-weight: 300;

        .challenge-title {
            color: $secondary-color;
            font-weight: 400;
            font-size: 22px;
            margin-bottom: 14px;
            @include defaultPaddingCard();
        }

        .welcome-image {
            width: 100%;
        }

        .description {
            margin-top: 8px;
            font-weight: 300;
            font-size: 16px;
            @include defaultPaddingCard();
        }

        .go-to-notification-setting {
            margin-top: 16px;
            margin-left: 0;
            @include defaultPaddingCard();
        }
    }
</style>