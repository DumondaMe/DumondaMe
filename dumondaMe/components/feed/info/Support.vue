<template>
    <div class="feed-support-container ely-card">
        <h3 class="feed-desktop-sidebar-title">{{$t('pages:feeds.support.title')}}</h3>
        <div class="description" v-html="$t('pages:feeds.support.description')"></div>
        <ul>
            <li v-html="$t('pages:feeds.support.support1')"></li>
            <li><span class="open-dialog" @click="openCreateDialog('showCreateQuestionDialog')">
                {{$t('pages:feeds.support.support2.text1')}} </span>
                {{$t('pages:feeds.support.support2.text2')}}
            </li>
            <li>{{$t('pages:feeds.support.support3')}}</li>
            <li>{{$t('pages:feeds.support.support4.text1')}}
                <span class="open-dialog" @click="openCreateDialog('showCreateCommitmentDialog')">
                {{$t('pages:feeds.support.support4.text2')}} </span>
                {{$t('pages:feeds.support.support4.text3')}}
            </li>
            <li>{{$t('pages:feeds.support.support5')}}</li>
        </ul>
        <social-media-links></social-media-links>
        <create-commitment-dialog v-if="showCreateCommitmentDialog" @close-dialog="showCreateCommitmentDialog = false">
        </create-commitment-dialog>
        <create-question-dialog v-if="showCreateQuestionDialog" @close-dialog="showCreateQuestionDialog = false">
        </create-question-dialog>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import CreateQuestionDialog from '~/components/question/dialog/CreateQuestionDialog.vue'
    import CreateCommitmentDialog from '~/components/commitment/dialog/CreateDialog.vue'
    import SocialMediaLinks from '~/components/info/SocialMediaLinks';

    export default {
        components: {CreateQuestionDialog, CreateCommitmentDialog, LoginRequiredDialog, SocialMediaLinks},
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
    .feed-support-container {
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
        ul {
            li {
                margin-bottom: 8px;
            }
        }
        .social-media-links-container {
            margin-top: 20px;
        }
    }
</style>