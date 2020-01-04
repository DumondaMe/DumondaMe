<template>
    <div id="feed-empty" class="ely-card">
        <div class="description" v-if="selectedFeedName === 'activity'">
            {{$t('pages:feeds.empty.descriptionActivityFilter')}}
        </div>
        <div v-else-if="selectedFeedName === 'question'">
            <div class="description">
                {{$t('pages:feeds.empty.descriptionQuestionFilter')}}
            </div>
            <v-btn color="primary" class="create-button" @click="openQuestionDialog">
                <v-icon dark left>$vuetify.icons.mdiPlus</v-icon>
                {{$t('common:toolbar.askQuestion')}}
            </v-btn>
        </div>
        <div class="description" v-else-if="selectedFeedName === 'commitment'">
            {{$t('pages:feeds.empty.descriptionCommitmentFilter')}}
        </div>
        <div class="description" v-else-if="selectedFeedName === 'event'">
            {{$t('pages:feeds.empty.descriptionEventFilter')}}
        </div>

        <create-question-dialog v-if="showCreateQuestionDialog" @close-dialog="showCreateQuestionDialog = false">
        </create-question-dialog>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import CreateQuestionDialog from '~/components/question/dialog/CreateQuestionDialog.vue'

    export default {
        name: "FeedEmpty",
        components: {LoginRequiredDialog, CreateQuestionDialog},
        computed: {
            selectedFeedName() {
                return this.$store.state.feedFilter.selectedFeedName;
            },
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        data() {
            return {showCreateQuestionDialog: false, showLoginRequired: false}
        },
        methods: {
            openQuestionDialog() {
                if (this.isAuthenticated) {
                    this.showCreateQuestionDialog = true;
                } else {
                    this.showLoginRequired = true;
                }
            }
        }
    }
</script>

<style lang="scss">
    #feed-empty.ely-card {
        margin-top: 32px;
        @include defaultPaddingCard();

        .description {
            color: $secondary-text;
            font-size: 18px;
        }

        .create-button {
            margin-top: 18px;
        }
    }
</style>