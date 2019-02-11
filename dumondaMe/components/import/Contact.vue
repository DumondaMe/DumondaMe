<template>
    <div class="imported-contact">
        <div v-if="!contact.userId">
            <v-checkbox v-model="contact.isSelected" color="primary" class="import-checkbox"
                        :disabled="contact.alreadySentInvitation || contact.notAllowedToSentInvitation">
                <div slot="label">
                    <div>{{getUserLabel}}</div>
                    <div v-if="contact.alreadySentInvitation" class="checkbox-info">
                        {{$t('dialog:invite.alreadySent')}}
                    </div>
                    <div v-else-if="contact.notAllowedToSentInvitation" class="checkbox-info">
                        {{$t('dialog:invite.notAllowedToSent')}}
                    </div>
                </div>
            </v-checkbox>
        </div>
        <div v-else class="existing-user">
            <div class="user-image">
                <img :src="contact.userImage"/>
            </div>
            <div class="user-content-container">
                <div class="user-name">{{contact.name}}</div>
                <div class="user-email-address">{{contact.email}}</div>
                <div class="add-to-trust-circle-container" v-if="!contact.isLoggedInUser">
                    <v-tooltip top v-if="contact.isTrustUser">
                        <v-btn color="primary" class="user-action-button" slot="activator"
                               :loading="loading" :disabled="loading"
                               @click="removeUserFromTrustCircle">
                            <v-icon left>mdi-check</v-icon>
                            {{$t('common:trustCircle')}}
                        </v-btn>
                        <span>{{$t('common:removeFromTrustCircle')}}</span>
                    </v-tooltip>
                    <v-tooltip top v-else>
                        <v-btn color="primary" class="user-action-button" slot="activator"
                               :loading="loading" :disabled="loading"
                               @click="addUserToTrustCircle">
                            <v-icon left>mdi-account-plus</v-icon>
                            {{$t('common:trustCircle')}}
                        </v-btn>
                        <span>{{$t('common:addToTrustCircle')}}</span>
                    </v-tooltip>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['contact'],
        data() {
            return {importContact: false, loading: false, showError: false}
        },
        components: {},
        methods: {
            async sendUserToTrustCircleCommand(command, isTrustUser) {
                try {
                    this.loading = true;
                    await this.$axios[command](`user/trustCircle/${this.contact.userId}`);
                    this.contact.isTrustUser = isTrustUser;
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.loading = false;
                }

            },
            async addUserToTrustCircle() {
                await this.sendUserToTrustCircleCommand('$post', true);
            },
            async removeUserFromTrustCircle() {
                await this.sendUserToTrustCircleCommand('$delete', false);
            }
        },
        computed: {
            getUserLabel() {
                if (this.contact.source) {
                    return `${this.contact.email} (${this.contact.source})`
                }
                return this.contact.email;
            },
        }
    }
</script>

<style lang="scss">
    .imported-contact {
        border-bottom: 1px solid $divider;

        .import-checkbox {
            display: inline-block;

            .checkbox-info {
                font-size: 14px;
                color: $warning;
            }
        }

        .existing-user {
            padding: 14px 0;
            display: flex;

            .user-image {
                height: 120px;
                width: 120px;

                @media screen and (max-width: $xs) {
                    height: 60px;
                    width: 60px;
                }

                img {
                    height: 100%;
                    width: 100%;
                    border-radius: 4px;
                }
            }

            .user-content-container {
                margin-left: 18px;
                position: relative;
                height: 120px;

                .user-name {
                    font-weight: 500;
                    line-height: 16px;
                    font-size: 16px;
                }

                .user-email-address {
                    margin-top: 6px;
                    font-size: 14px;
                    color: $secondary-text;
                }

                .add-to-trust-circle-container {
                    position: absolute;
                    bottom: 0;

                    .user-action-button {
                        margin-top: 12px;
                        margin-bottom: 0;
                        margin-left: 0;
                    }
                }
            }
        }
    }
</style>
