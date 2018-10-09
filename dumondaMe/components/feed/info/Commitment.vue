<template>
    <div class="feed-commitment-info ely-card">
        <h3 class="feed-desktop-sidebar-title">{{$t('pages:feeds.commitmentInfo.title')}}</h3>
        <div class="description">{{$t('pages:feeds.commitmentInfo.description')}}</div>
        <div class="open-dialog" @click="openCreateDialog('showCreateCommitmentDialog')">
            {{$t('pages:feeds.commitmentInfo.create')}}</div>
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
        }
        .description {
            margin-bottom: 8px;
        }
        .open-dialog {
            cursor: pointer;
            color: $primary-color;
            text-decoration: underline;
        }
    }
</style>