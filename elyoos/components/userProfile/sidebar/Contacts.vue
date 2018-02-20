<template>
    <div class="sidebar-container">
        <h3>{{$t("pages:detailUser.sidebar.contacts.title")}}</h3>
        <div class="general-contact-info">
            {{$t("pages:detailUser.sidebar.contacts.contactInfo", {count: user.numberOfContacts})}}
        </div>
        <div class="contact-info" v-for="contact in user.contacts">
            <div class="image-container">
                <img :src="contact.profileUrl">
            </div>
            <div class="user-info">
                <div class="user-name">{{contact.name}}</div>
                <div class="user-added">
                    {{$t("pages:detailUser.sidebar.contacts.since", {date: getDate(contact.isContactSince)})}}
                </div>
            </div>
            <div class="user-settings">
                <v-menu bottom left>
                    <v-btn icon slot="activator">
                        <v-icon>more_vert</v-icon>
                    </v-btn>
                    <v-list>
                        <v-list-tile @click="">
                            <v-list-tile-title>Kein Kontakt mehr</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="">
                            <v-list-tile-title>Blockieren</v-list-tile-title>
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
            user() {
                return this.$store.state.userProfile.user;
            }
        },
        methods: {
            getDate(date) {
                return this.$options.filters.formatDateOnly(date);
            },
            async loadNextContacts() {

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
                margin-right: 12px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
            .user-info {
                flex-grow: 1;
                .user-name {
                    font-size: 14px;
                }
                .user-added {
                    font-size: 12px;
                    color: $secondary-text;
                }
            }
            .user-settings {

            }
        }
        button {
            margin-left: 0;
        }
    }
</style>
