<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <v-card id="dialog-invite-user-to-answer-question">
                <div id="dumonda-me-dialog-header">
                    {{$t("pages:question.askUserAnswerQuestion.title")}}
                </div>
                <v-divider></v-divider>
                <v-card-text id="dialog-invite-user-to-answer-question-content" class="mobile-dialog-content">
                    <v-text-field type="text" v-model="search" name="search" :loading="running"
                                  :label="$t('pages:question.askUserAnswerQuestion.inviteDialog.searchLabel')">
                    </v-text-field>
                    <p v-if="showHelpText">{{$t("pages:question.askUserAnswerQuestion.inviteDialog.description")}}</p>
                    <div v-else>
                        <div v-for="user in users">
                            <user :user="user" :init-selection="user.initIsSelected" :key="user.userId || user.email"
                                  @select-changed="selectedChanged">
                            </user>
                        </div>
                        <div class="invitation-already-sent-title">
                            {{$t("pages:question.askUserAnswerQuestion.inviteDialog.alreadySentTitle")}}
                        </div>
                        <div v-for="user in invitationAlreadySent">
                            <user :user="user" :init-selection="true" :is-read-only="true"></user>
                        </div>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <div id="number-of-selected-users" :class="{'max-number-of-users': numberOfSelected > 29}">
                        {{numberOfSelected}}/30
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')" :disabled="running">
                        {{$t("common:button.abort")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="sendInvitation()"
                           :loading="running" :disabled="running || selectedUsers.length === 0 ||
                           numberOfSelected > 29">
                        {{$t("common:button.sent")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import debounce from 'debounce';
    import User from './User';
    import Vue from 'vue';

    export default {
        props: ['questionId'],
        data() {
            return {
                dialog: true, search: '', running: false, showError: false, users: [], selectedUsers: [],
                showHelpText: true, invitationAlreadySent: []
            }
        },
        components: {User},
        computed: {
            numberOfSelected() {
                return this.invitationAlreadySent.length + this.selectedUsers.length;
            }
        },
        async mounted() {
            try {
                this.running = true;
                let response = await this.$axios.$get(`user/question/invite/alreadySent`,
                    {params: {questionId: this.questionId}});
                this.invitationAlreadySent = response.users;
                if (this.invitationAlreadySent.length > 0) {
                    this.showHelpText = false;
                }
            } finally {
                this.running = false;
            }
        },
        methods: {
            indexOfUsers(users, user) {
                return users.findIndex(function (selectedUser) {
                    return (selectedUser.hasOwnProperty('userId') && user.userId === selectedUser.userId) ||
                        (selectedUser.hasOwnProperty('email') && user.email === selectedUser.email)
                });
            },
            selectedChanged(user) {
                let index = this.indexOfUsers(this.selectedUsers, user);
                if (index > -1) {
                    this.selectedUsers.splice(index, 1);
                } else {
                    Vue.set(user, 'initIsSelected', true);
                    this.selectedUsers.push(user);
                }
            },
            handlingAddingUsers(newUsers) {
                let users = [];
                for (let newUser of newUsers) {
                    let index = this.indexOfUsers(this.selectedUsers, newUser);
                    Vue.set(newUser, 'initIsSelected', index > -1);
                    users.push(newUser);
                }
                for (let selectedUser of this.selectedUsers) {
                    let index = this.indexOfUsers(newUsers, selectedUser);
                    if (index === -1) {
                        users.push(selectedUser);
                    }
                }
                return users;
            },
            async sendInvitation() {
                try {
                    this.running = true;
                    await this.sendInvitationRegisteredUser();
                    await this.sendInvitationNotRegisteredUser();
                    this.$emit('close-dialog');
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.running = false;
                }
            },
            async sendInvitationRegisteredUser() {
                let userIds = this.selectedUsers.filter(user => user.hasOwnProperty('userId'))
                    .map(user => user.userId);
                if (userIds.length > 0) {
                    await this.$axios.$put(`user/question/invite`, {questionId: this.questionId, userIds});
                }
            },
            async sendInvitationNotRegisteredUser() {
                let emails = this.selectedUsers.filter(user => user.hasOwnProperty('email'))
                    .map(user => user.email);
                if (emails.length > 0) {
                    await this.$axios.$put(`user/question/invite/notRegisteredUser`,
                        {questionId: this.questionId, emails});
                }
            }
        },
        watch: {
            search: debounce(async function (newSearch) {
                if (typeof newSearch === 'string' && newSearch.trim().length > 1) {
                    try {
                        this.running = true;
                        let response = await this.$axios.$get(`user/question/invite/search`, {
                            params: {questionId: this.questionId, skip: 0, limit: 10, query: newSearch}
                        });
                        this.users = this.handlingAddingUsers(response.users);
                        this.showHelpText = false;
                    } catch (error) {

                    } finally {
                        this.running = false;
                    }
                } else {
                    this.users = JSON.parse(JSON.stringify(this.selectedUsers));
                }
            }, 500)
        }
    }
</script>

<style lang="scss">
    #dialog-invite-user-to-answer-question {
        max-width: 650px;

        #dumonda-me-dialog-header {
            max-width: 650px;
        }

        #dialog-invite-user-to-answer-question-content {
            max-width: 650px;

            .invitation-already-sent-title {
                font-weight: 500;
                font-size: 16px;
                margin-top: 12px;
                padding-top: 12px;
                margin-bottom: 18px;
                border-top: 1px solid $divider;
            }
        }

        #number-of-selected-users {
            margin-left: 8px;
        }

        #number-of-selected-users.max-number-of-users {
            color: $error-text;
        }
    }
</style>
