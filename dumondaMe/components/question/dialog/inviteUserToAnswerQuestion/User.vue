<template>
    <div class="user-to-invite-to-answer-question">
        <v-checkbox v-model="sendMessageToUser" color="secondary"
                    :readonly="user.unsubscribed || user.alreadySent || user.isRegisteredUser || isReadOnly">
            <div slot="label">
                <div v-if="!user.userId" class="email-label">
                    <div>{{user.email}}</div>
                    <div class="user-info" v-if="user.unsubscribed">
                        {{$t('pages:question.askUserAnswerQuestion.inviteDialog.unsubscribedUser')}}
                    </div>
                    <div class="user-info" v-else-if="user.alreadySent">
                        {{$t('pages:question.askUserAnswerQuestion.inviteDialog.alreadySent')}}
                    </div>
                    <div class="user-info" v-else-if="user.isRegisteredUser">
                        {{$t('pages:question.askUserAnswerQuestion.inviteDialog.isRegisteredUser')}}
                    </div>
                </div>
                <div v-else class="existing-user">
                    <div class="user-image">
                        <img :src="user.userImage"/>
                    </div>
                    <div class="user-content-container">
                        <div class="user-name" :class="{'user-info-visible': !user.sendingEmailAllowed && !isReadOnly}">
                            {{user.name}}
                        </div>
                        <div class="user-info" v-if="!user.sendingEmailAllowed && !isReadOnly">
                            {{$t('pages:question.askUserAnswerQuestion.inviteDialog.notAllowedToSend')}}
                        </div>
                    </div>
                </div>
            </div>
        </v-checkbox>
    </div>
</template>

<script>

    export default {
        props: ['user', 'initSelection', 'isReadOnly'],
        data() {
            return {sendMessageToUser: this.initSelection, loading: false}
        },
        components: {},
        methods: {},
        computed: {},
        watch: {
            sendMessageToUser() {
                this.$emit('select-changed', this.user);
            }
        }
    }
</script>

<style lang="scss">
    .user-to-invite-to-answer-question {

        .email-label {
            margin-left: 12px;

            .user-info {
                font-size: 14px;
                margin-top: 6px;
                line-height: 14px;
                color: $warning;
            }
        }

        .existing-user {
            display: flex;

            .user-image {
                height: 40px;
                width: 40px;
                margin-left: 12px;

                img {
                    height: 100%;
                    width: 100%;
                    border-radius: 4px;
                }
            }

            .user-content-container {
                margin-left: 12px;

                .user-name {
                    font-weight: 500;
                    line-height: 40px;
                    font-size: 16px;

                }

                .user-name.user-info-visible {
                    line-height: 16px;
                }

                .user-info {
                    font-size: 14px;
                    margin-top: 10px;
                    line-height: 14px;
                    color: $warning;
                }
            }

        }

        .v-input--selection-controls {
            margin-top: 4px;

            .v-input__control {
                .v-input__slot {
                    margin-bottom: 0;
                }
            }
        }
    }
</style>
