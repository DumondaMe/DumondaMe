<template>
    <div class="feed-commitment-info ely-card">
        <h3 class="feed-desktop-sidebar-title">{{$t('pages:feeds.commitmentInfo.title')}}</h3>
        <img v-lazy="commitmentImage" :data-srcset="commitment2xImage" class="commitment-image"
             @click="showConceptInfoDialog = true">
        <div class="description">{{$t('pages:feeds.commitmentInfo.description')}}</div>
        <div class="open-dialog" @click="openCreateDialog('showCreateCommitmentDialog')">
            {{$t('pages:feeds.commitmentInfo.create')}}
        </div>
        <create-commitment-dialog v-if="showCreateCommitmentDialog" @close-dialog="showCreateCommitmentDialog = false">
        </create-commitment-dialog>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import CreateCommitmentDialog from '~/components/commitment/dialog/CreateDialog.vue'

    export default {
        components: {CreateCommitmentDialog, LoginRequiredDialog},
        data() {
            return {showCreateQuestionDialog: false, showCreateCommitmentDialog: false, showLoginRequired: false}
        },
        computed: {
            commitmentImage() {
                return `${process.env.staticUrl}/img/welcome/commitment.jpg`;
            },
            commitment2xImage() {
                return `${process.env.staticUrl}/img/welcome/commitment.jpg 300w, ` +
                    `${process.env.staticUrl}/img/welcome/commitment.jpg 600w`;
            }
        },
        methods: {
            openCreateDialog(dialogName) {
                if (this.$store.state.auth.userIsAuthenticated) {
                    this[dialogName] = true
                } else {
                    this.showLoginRequired = true;
                }
            }
        }
    }
</script>

<style lang="scss">
    .feed-commitment-info {
        margin-bottom: 18px;
        font-size: 14px;
        font-weight: 300;

        h3.feed-desktop-sidebar-title {
            margin-bottom: 12px;
            @include defaultPaddingCard();
        }

        .commitment-image {
            width: 100%;
        }

        .description {
            margin-bottom: 8px;
            @include defaultPaddingCard();
        }

        .open-dialog {
            cursor: pointer;
            color: $primary-color;
            text-decoration: underline;
            @include defaultPaddingCard();
        }
    }
</style>