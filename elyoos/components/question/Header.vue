<template>
    <div id="elyoos-question-header">
        <div id="elyoos-question-header-content">
            <div id="question-header-main">
                <h1 itemprop="name">{{question.question}}</h1>
                <p id="question-description" itemprop="text"><span v-html="question.descriptionHtml"></span></p>
                <div id="question-commands">
                    <user-menu :menu-title="creatorTitle" :user-image="question.creator.userImagePreview"
                               :user-name="question.creator.name" :user-id="question.creator.userId"
                               :user-slug="question.creator.slug"
                               :is-trust-user="question.creator.isTrustUser" :is-logged-in-user="question.isAdmin">
                        <div class="user-icon" slot="icon">
                            <img :src="question.creator.userImage">
                        </div>
                    </user-menu>
                    <div>
                        <watches-menu :user-id="question.creator.userId" :user-name="question.creator.name"
                                      :watched-id="question.questionId"
                                      watched-id-name="questionId" :user-slug="question.creator.slug"
                                      :is-logged-in-user="question.isLoggedInUser" :is-watching-action="false"
                                      :is-admin="question.isAdmin"
                                      :watched-by-user="question.userWatchesQuestion"
                                      :number-of-watches="question.numberOfWatches"
                                      menu-translation="watchesQuestion" api-get-user-command="question/watches"
                                      api-watch="user/question/watch"
                                      @add-watch="addWatch" @remove-watch="removeWatch">
                            <div slot="icon">
                                <v-btn slot="activator" small fab color="primary" v-if="!question.userWatchesQuestion">
                                    <v-icon>mdi-lightbulb-outline</v-icon>
                                </v-btn>
                                <v-btn slot="activator" small fab color="user-watches-question"
                                       v-else>
                                    <v-icon>mdi-lightbulb</v-icon>
                                </v-btn>
                                <span class="description">{{question.numberOfWatches}}</span>
                            </div>
                        </watches-menu>
                    </div>
                    <div>
                        <v-btn slot="activator" small fab color="primary" @click="openCreateAnswerDialog()">
                            <v-icon>mdi-forum</v-icon>
                        </v-btn>
                        <span class="description">{{question.numberOfAnswers}}</span>
                    </div>
                    <admin-commands v-if="question.isAdmin"></admin-commands>
                </div>
            </div>
        </div>

        <v-layout row justify-center>
            <v-dialog v-model="dialog" scrollable persistent max-width="770px">
                <create-dialog @close-dialog="dialog = false" v-if="dialog">
                </create-dialog>
            </v-dialog>
        </v-layout>

        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import UserMenu from '~/components/feed/card/footer/menu/User';
    import WatchesMenu from '~/components/feed/card/footer/menu/Watches';
    import CreateDialog from '~/components/question/answer/dialog/CreateDialog.vue';
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired.vue';
    import AdminCommands from './AdminCommands';

    export default {
        components: {UserMenu, WatchesMenu, CreateDialog, LoginRequiredDialog, AdminCommands},
        data() {
            return {dialog: false, showLoginRequired: false}
        },
        computed: {
            question() {
                return this.$store.state.question.question;
            },
            creatorTitle() {
                if (this.question.isAdmin) {
                    return this.$t("pages:feeds.menu.creatorQuestion.titleIsLoggedInUser");
                }
                return this.$t("pages:feeds.menu.creatorQuestion.title");
            }
        },
        methods: {
            openCreateAnswerDialog() {
                if (this.$store.state.auth.userIsAuthenticated) {
                    this.dialog = true;
                } else {
                    this.showLoginRequired = true;
                }
            },
            async addWatch() {
                this.$store.commit('question/SET_WATCH');
            },
            async removeWatch() {
                this.$store.commit('question/REMOVE_WATCH');
            }
        },
    }
</script>

<style lang="scss">
    #elyoos-question-header {
        margin-bottom: 48px;
        #elyoos-question-header-content {
            display: flex;
            #question-header-main {
                max-width: 550px;
            }
            h1 {
                margin-bottom: 4px;
                font-size: 28px;
            }
            #question-description {
                margin-top: 12px;
                font-size: 16px;
                font-weight: 300;
            }
            #question-commands {
                margin-top: 24px;
                display: flex;
                .user-icon {
                    height: 40px;
                    width: 40px;
                    margin-right: 24px;
                    img {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .user-watches-question {
                    background-color: #607D8B;
                    i.v-icon {
                        color: white;
                    }
                }
                .description {
                    display: inline-block;
                    font-size: 16px;
                    font-weight: 500;
                    color: $secondary-text;
                    margin-left: 10px;
                    margin-right: 20px;
                    vertical-align: middle;
                }
                button {
                    margin: 0;
                }
            }
        }
    }
</style>
