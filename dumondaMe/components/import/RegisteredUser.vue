<template>
    <div class="imported-registered-user" :class="{'last-registered-user': lastRegisteredUser}">
        <div class="user-image">
            <img :src="contact.userImage"/>
        </div>
        <div class="user-content-container">
            <div class="user-name">{{contact.name}}</div>
            <div class="user-email-address">{{contact.email}}</div>
            <div class="add-to-trust-circle-container" v-if="!contact.isLoggedInUser">
                <v-tooltip top v-if="contact.isTrustUser">
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" class="user-action-button" v-on="on"
                               :loading="loading" :disabled="loading"
                               @click="removeUserFromTrustCircle">
                            <v-icon left>mdi-check</v-icon>
                            {{$t('common:trustCircle')}}
                        </v-btn>
                    </template>
                    <span>{{$t('common:removeFromTrustCircle')}}</span>
                </v-tooltip>
                <v-tooltip top v-else>
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" class="user-action-button" v-on="on"
                               :loading="loading" :disabled="loading"
                               @click="addUserToTrustCircle">
                            <v-icon left>mdi-account-plus</v-icon>
                            {{$t('common:trustCircle')}}
                        </v-btn>
                    </template>
                    <span>{{$t('common:addToTrustCircle')}}</span>
                </v-tooltip>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['contact', 'lastRegisteredUser'],
        data() {
            return {loading: false, showError: false}
        },
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
        }
    }
</script>

<style lang="scss">
    .imported-registered-user {
        padding: 14px 0;
        display: flex;
        border-bottom: 1px solid $divider;

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

            @media screen and (min-width: $xs) {
                position: relative;
                height: 120px;
            }

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

                @media screen and (min-width: $xs) {
                    position: absolute;
                    bottom: 0;
                }

                .user-action-button {
                    margin-top: 12px;
                    margin-bottom: 0;
                    margin-left: 0;
                }
            }
        }
    }

    .imported-registered-user.last-registered-user {
        border-bottom: none;
    }
</style>
