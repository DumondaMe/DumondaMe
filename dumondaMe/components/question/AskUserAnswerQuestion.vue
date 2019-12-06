<template>
    <div class="ask-user-answer-question ely-card">
        <h3 class="ask-user-answer-question-title">{{$t('pages:question.askUserAnswerQuestion.title')}}</h3>
        <img :src="askImage" :srcset="ask2xImage" class="ask-user-image">
        <div class="description">{{$t('pages:question.askUserAnswerQuestion.description')}}</div>
        <div class="send-button-image-container">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <div class="invite-button" v-on="on" @click="showInviteUserToAnswerQuestionDialog = true">
                        <img :src="dumondaMeImage"/>
                    </div>
                </template>
                <span>{{$t('pages:question.askUserAnswerQuestion.dumondaMeButton')}}</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <a class="invite-button" :href="whatsAppLink" target="_blank" rel="noopener" v-on="on">
                        <img :src="whatsAppImage"/>
                    </a>
                </template>
                <span>{{$t('pages:question.askUserAnswerQuestion.whatsAppButton')}}</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <a class="invite-button last" :href="telegramLink" target="_blank" rel="noopener" v-on="on">
                        <img :src="telegramImage"/>
                    </a>
                </template>
                <span>{{$t('pages:question.askUserAnswerQuestion.telegramButton')}}</span>
            </v-tooltip>
        </div>
        <invite-user-to-answer-question-dialog v-if="showInviteUserToAnswerQuestionDialog"
                                               :question-id="$route.params.questionId"
                                               @close-dialog="showInviteUserToAnswerQuestionDialog = false">
        </invite-user-to-answer-question-dialog>
    </div>
</template>

<script>
    import InviteUserToAnswerQuestionDialog from './dialog/inviteUserToAnswerQuestion/InviteDialog'

    export default {
        components: {InviteUserToAnswerQuestionDialog},
        data() {
            return {showInviteUserToAnswerQuestionDialog: false}
        },
        methods: {
            getQuestionLink() {
                return `Kannst%20du%20die%20folgende%20Frage%20beantworten%3F%3A%20` +
                    encodeURIComponent(`https://www.dumonda.me/question/${this.$route.params.questionId}/${this.$route.params.slug}`);
            }
        },
        computed: {
            askImage() {
                return `${process.env.staticUrl}/img/question/ask.jpg`;
            },
            ask2xImage() {
                return `${process.env.staticUrl}/img/question/ask_2x.jpg 2x`;
            },
            whatsAppLink() {
                return `https://wa.me/?text=${this.getQuestionLink()}`;
            },
            whatsAppImage() {
                return `${process.env.staticUrl}/img/socialMedia/link/whatsApp.png`;
            },
            telegramLink() {
                return `https://telegram.me/share/url?url=${this.getQuestionLink()}`;
            },
            telegramImage() {
                return `${process.env.staticUrl}/img/socialMedia/link/telegram.png`;
            },
            dumondaMeImage() {
                return `${process.env.staticUrl}/img/socialMedia/link/dumondaMe.png`;
            },
        }
    }
</script>

<style lang="scss">
    .ask-user-answer-question.ely-card {
        margin-bottom: 12px;

        h3.ask-user-answer-question-title {
            margin-bottom: 12px;
            font-size: 16px;
            font-weight: 500;
            @include defaultPaddingCard();
        }

        .ask-user-image {
            width: 100%;
            margin-bottom: 8px;
        }

        .description {
            font-size: 14px;
            font-weight: 300;
            @include defaultPaddingCard();
        }

        .send-button-image-container {
            margin-top: 18px;
            @include defaultPaddingCard();

            .invite-button {
                cursor: pointer;
                display: inline-block;
                height: 32px;
                width: 32px;
                margin-right: 14px;

                img {
                    height: 100%;
                    border-radius: 2px;
                }
            }
        }
    }
</style>
