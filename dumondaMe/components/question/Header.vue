<template>
    <div id="dumonda-me-question-header">
        <div id="dumonda-me-question-header-content">
            <div id="question-header-main" class="ely-card">
                <div id="question-title-container">
                    <h1 itemprop="name" :class="{'show-all-answer': showOnlyOneAnswer}"
                        @click="showAllAnswers()">{{question.question}}</h1>
                    <v-spacer></v-spacer>
                    <admin-commands v-if="question.isAdmin" id="admin-button-desktop"></admin-commands>
                </div>
                <p id="question-description" itemprop="text"><span v-html="question.descriptionHtml"></span></p>
                <div id="question-commands">
                    <user-menu :menu-title="creatorTitle" :user="question.creator"
                               @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                               @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
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
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <v-btn v-on="on" small fab color="primary"
                                               v-if="!question.userWatchesQuestion"
                                               :disabled="question.isAdmin">
                                            <v-icon size="20">mdi-star-outline</v-icon>
                                        </v-btn>
                                        <v-btn v-on="on" small fab color="user-watches-question"
                                               v-else>
                                            <v-icon size="20">mdi-star</v-icon>
                                        </v-btn>
                                    </template>
                                    <span v-if="!question.userWatchesQuestion || question.isAdmin">
                            {{$t('common:feedCard.watch.userHasNotWatched')}}</span>
                                    <span v-else>{{$t('common:you')}}
                            {{$t('pages:feeds.menu.watchesQuestion.titleIsLoggedInUser')}}</span>
                                </v-tooltip>
                                <span class="description" itemprop="upvoteCount">{{question.numberOfWatches}}</span>
                            </div>
                        </watches-menu>
                    </div>
                    <div>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" small fab color="primary" @click="openCreateAnswerDialog()">
                                    <v-icon size="20">mdi-forum</v-icon>
                                </v-btn>
                            </template>
                            <span>{{$t('pages:feeds.menu.questions.numberOfAnswers',
                                {count: question.numberOfAnswers})}}</span>
                        </v-tooltip>
                        <span class="description" itemprop="answerCount">{{question.numberOfAnswers}}</span>
                    </div>
                </div>
                <create-answer-button @answer-question="openCreateAnswerDialog"></create-answer-button>
            </div>
        </div>

        <v-layout row justify-center v-if="dialog">
            <v-dialog v-model="dialog" scrollable persistent max-width="770px" :fullscreen="$vuetify.breakpoint.xsOnly">
                <create-dialog @close-dialog="dialog = false">
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
    import CreateAnswerButton from './CreateAnswerButton';
    import Suggestion from './Suggestion';

    export default {
        components: {
            UserMenu, WatchesMenu, CreateDialog, LoginRequiredDialog, AdminCommands, Suggestion,
            CreateAnswerButton
        },
        data() {
            return {dialog: false, showLoginRequired: false}
        },
        computed: {
            question() {
                return this.$store.state.question.question;
            },
            showOnlyOneAnswer() {
                return !!this.$route.query.answerId
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
            },
            async addUserToTrustCircle(userId) {
                this.$store.commit('question/ADD_USER_TO_TRUST_CIRCLE', userId);
            },
            async removeUserFromTrustCircle(userId) {
                this.$store.commit('question/REMOVE_USER_FROM_TRUST_CIRCLE', userId);
            },
            async showAllAnswers() {
                try {
                    await this.$store.dispatch('question/showAllAnswers');
                    this.$router.replace({
                        name: 'question-questionId-slug',
                        params: {questionId: this.$route.params.questionId, slug: this.$route.params.slug}
                    });
                } catch (err) {

                }
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-question-header {
        @media screen and (max-width: $xs) {
            margin-bottom: 12px;
        }

        #dumonda-me-question-header-content {
            display: flex;

            #question-header-main {
                position: relative;
                max-width: 550px;
                width: 100%;
                background-color: #e0f2f1;
                @include defaultPaddingCard();
            }

            #question-title-container {
                display: flex;

                h1 {
                    margin-bottom: 8px;
                    font-size: 26px;
                    line-height: 42px;
                    font-weight: 500;
                    color: $primary-color;
                    @media screen and (max-width: $xs) {
                        font-size: 24px;
                        line-height: 28px;
                        margin-bottom: 18px;
                    }
                }

                h1.show-all-answer {
                    cursor: pointer;
                }
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

                #suggestion-button-desktop {
                    margin-right: 16px;
                    @media screen and (max-width: 780px) {
                        display: none;
                    }
                }

                #admin-button-desktop {
                    @media screen and (max-width: 780px) {
                        display: none;
                    }
                }
            }
        }
    }
</style>
