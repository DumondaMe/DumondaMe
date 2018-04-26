<template>
    <div class="sidebar-container">
        <h3>{{$t("pages:detailUser.trustCircle.title")}}</h3>
        <div class="general-contact-info">
            <span v-if="user.isLoggedInUser">
                {{$t("pages:detailUser.trustCircle.loggedInUserInfo", {count: user.numberOfContacts})}}
            </span>
            <span v-else>
                {{$t("pages:detailUser.trustCircle.otherUserInfo", {count: user.numberOfContacts})}}
            </span>
        </div>
        <div class="contact-info" v-for="contact in user.contacts">
            <div class="image-container" @click="$router.push({name: 'user-userId-slug',
                     params: {userId: contact.userId, slug: contact.slug}})">
                <img :src="contact.profileUrl">
            </div>
            <div class="user-info-container">
                <div class="user-name"
                     @click="$router.push({name: 'user-userId-slug',
                     params: {userId: contact.userId, slug: contact.slug}})">{{contact.name}}
                </div>
                <div class="user-info" v-if="isAuthenticated">
                    <v-tooltip bottom debounce="1500">
                        <v-icon :class="{'out-of-trust-circle': !contact.isContactOfLoggedInUser, 'in-trust-circle': contact.isContactOfLoggedInUser}"
                                slot="activator">
                            mdi-account-circle
                        </v-icon>
                        <span v-if="contact.isContactOfLoggedInUser">{{$t("pages:detailUser.trustCircle.inYourCircle")}}</span>
                        <span v-else>{{$t("pages:detailUser.trustCircle.notInYourCircle")}}</span>
                    </v-tooltip>
                    <span v-if="user.isLoggedInUser && contact.isContactSince">
                        {{$t("pages:detailUser.trustCircle.since", {date: getDate(contact.isContactSince)})}}</span>
                </div>
            </div>
            <div class="user-settings" v-if="isAuthenticated">
                <v-menu bottom left>
                    <v-btn icon slot="activator">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile v-if="contact.isContactOfLoggedInUser"
                                     @click="removeUserFromTrustCircle(contact.userId)">
                            <v-list-tile-title>{{$t("pages:detailUser.trustCircle.removeFromYourCircle")}}
                            </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile v-else @click="addUserToTrustCircle(contact.userId)">
                            <v-list-tile-title>{{$t("pages:detailUser.trustCircle.addToYourCircle")}}
                            </v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="">
                            <v-list-tile-title>{{$t("pages:detailUser.trustCircle.blockUser")}}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
        </div>
        <v-btn outline color="primary" @click="loadNextContacts()" v-if="user.contacts.length < user.numberOfContacts">
            {{$t("common:button.showMore")}}
        </v-btn>
    </div>
</template>

<script>
    export default {
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            user() {
                return this.$store.state.userProfile.user;
            }
        },
        methods: {
            getDate(date) {
                return this.$options.filters.formatDateOnly(date);
            },
            async loadNextContacts() {

            },
            addUserToTrustCircle(userId) {
                this.$store.dispatch('userProfile/addUserToTrustCircle', userId);
            },
            removeUserFromTrustCircle(userId) {
                this.$store.dispatch(`userProfile/removeUserFromTrustCircle`, userId);
            }
        }
    }
</script>

<style lang="scss">
    .sidebar-container {
        .general-contact-info {
            font-size: 14px;
            color: $secondary-text;
            margin-bottom: 12px;
        }
        .contact-info {
            display: flex;
            margin-bottom: 8px;
            .image-container {
                height: 36px;
                width: 36px;
                margin-top: 4px;
                margin-right: 12px;
                cursor: pointer;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
            .user-info-container {
                flex-grow: 1;
                .user-name {
                    display: inline-block;
                    font-size: 14px;
                    cursor: pointer;
                }
                :hover.user-name {
                    text-decoration: underline;
                }
                .user-info {
                    font-size: 12px;
                    color: $secondary-text;
                    i {
                        display: inline-block;
                        color: $success-text;
                        font-size: 19px;
                        height: 19px;
                        width: 19px;
                        vertical-align: inherit;
                        cursor: pointer;
                    }
                    span {
                        vertical-align: top;
                    }
                    .in-trust-circle {
                        color: $success-text;
                    }
                    .out-of-trust-circle {
                        color: $secondary-text;
                    }
                }
            }
            .user-settings {
                .button {
                    i {
                        color: #666666;
                    }
                }
            }
        }

        button {
            margin-left: 0;
        }

    }
</style>
