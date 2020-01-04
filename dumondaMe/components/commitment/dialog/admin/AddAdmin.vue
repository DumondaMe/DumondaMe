<template>
    <v-card id="dialog-add-admin-commitment">
        <div>
            <div id="dumonda-me-dialog-header">
                {{$t('pages:detailCommitment.adminDialog.titleAddAdmin', getTitle())}}
            </div>
            <v-divider></v-divider>
        </div>
        <v-card-text id="dialog-add-admin-commitment-content" class="mobile-dialog-content">
            <v-text-field v-model="userQuery" :loading="loadingRunning"
                          :label="$t('pages:detailCommitment.adminDialog.searchAdmin')"
                          :rules="[ruleToManyChars($t('validation:toManyChars'), 255)]">
            </v-text-field>
            <div id="user-to-add-container">
                <div class="user-to-add" v-for="user in users" @click="setSelectedUser(user)"
                     :class="{'is-selected-user': selectedUser && user.userId === selectedUser.userId,
                     'not-allowed-to-select-user': !isAllowedToBeSelected(user)}">
                    <div class="user-image">
                        <img :src="user.userImage">
                    </div>
                    <div class="user-info">
                        <div class="user-name">{{user.name}}</div>
                        <div class="user-status-info" v-if="user.isRequestAdminOfCommitmentActive">
                            {{$t("pages:detailCommitment.adminDialog.isRequestAdminOfCommitmentActive")}}
                        </div>
                        <div class="user-status-info" v-else-if="user.isTrustUser">
                            {{$t("pages:detailCommitment.adminDialog.isTrustUser")}}
                        </div>
                    </div>
                </div>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click.native="$emit('close-dialog')">
                {{$t("common:button.abort")}}
            </v-btn>
            <v-btn color="primary" @click.native="sendAddToCommitmentRequest()" :disabled="selectedUser === null"
                   :loading="loadingRunning">
                <v-icon left>$vuetify.icons.mdiAccountPlus</v-icon>
                {{$t("pages:detailCommitment.adminDialog.addAdminButton")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import debounce from 'debounce';

    export default {
        props: ['commitmentId'],
        data() {
            return {userQuery: '', loadingRunning: false, users: [], selectedUser: null}
        },
        components: {},
        mixins: [validationRules],
        methods: {
            getTitle() {
                return JSON.parse(JSON.stringify({commitment: this.$store.getters['commitment/getCommitment'].title}));
            },
            async sendAddToCommitmentRequest() {
                if (this.selectedUser) {
                    try {
                        this.loadingRunning = true;
                        await this.$store.dispatch('commitment/addAdmin', this.selectedUser.userId);
                        this.$store.commit('commitment/ADD_ADMIN_REQUESTED', {
                            userId: this.selectedUser.userId, name: this.selectedUser.name,
                            profileUrl: this.selectedUser.userImage
                        });
                        this.$emit('close-dialog');
                    } finally {
                        this.loadingRunning = false;
                    }
                }
            },
            setSelectedUser(user) {
                if (this.isAllowedToBeSelected(user)) {
                    this.selectedUser = user;
                }
            },
            selectedUserExists() {
                if (this.selectedUser !== null) {
                    for (let user of this.users) {
                        if (user.userId === this.selectedUser.userId) {
                            return true;
                        }
                    }
                }
                return false;
            },
            isAllowedToBeSelected(user) {
                return !user.isAdminOfCommitment && !user.isRequestAdminOfCommitmentActive;
            }
        },
        watch: {
            userQuery: {
                handler: debounce(async function (newUserQuery) {
                    if (typeof newUserQuery === 'string' && newUserQuery.trim().length > 1)
                        try {
                            this.loadingRunning = true;
                            let response = await this.$axios.$get('user/commitment/search/user',
                                {
                                    params: {
                                        query: newUserQuery.trim(), commitmentId: this.commitmentId,
                                        skip: 0, limit: 10
                                    }
                                });
                            this.users = response.users;
                        } finally {
                            this.loadingRunning = false;
                            if (!this.selectedUserExists()) {
                                this.selectedUser = null;
                            }
                        }
                }, 400)
            }
        }
    }
</script>

<style lang="scss">
    #dialog-add-admin-commitment {
        max-width: 650px;

        #dialog-add-admin-commitment-content {
            max-width: 650px;

            #user-to-add-container {
                .user-to-add {
                    display: flex;
                    cursor: pointer;
                    padding: 6px 0;

                    .user-image {
                        width: 80px;
                        height: 80px;

                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 6px;
                        }
                    }

                    .user-info {
                        padding-left: 16px;

                        .user-name {
                            font-weight: 500;
                        }

                        .user-status-info {
                            font-size: 12px;
                            color: $secondary-text;
                        }
                    }
                }

                .user-to-add.is-selected-user {
                    background-color: $selected;
                    border-radius: 6px;
                }

                .user-to-add.not-allowed-to-select-user {
                    cursor: not-allowed;
                }
            }
        }
    }
</style>
