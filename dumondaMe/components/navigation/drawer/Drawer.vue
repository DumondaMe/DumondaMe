<template>
    <div id="navigation-drawer">
        <div id="dumonda-me-logo-container">
            <img :src="logo">
        </div>
        <v-divider></v-divider>
        <div class="common-navigation">
            <nav-item v-if="isAuthenticated" nuxt-link="index" icon="mdi-heart-pulse"
                      :nav-text="$t('common:navigation.activities')"></nav-item>
            <nav-item v-else nuxt-link="index" icon="mdi-home-outline"
                      :nav-text="$t('common:navigation.home')"></nav-item>
            <nav-item nuxt-link="question" icon="mdi-help" :nav-text="$t('common:navigation.questions')"></nav-item>
            <nav-item nuxt-link="commitment" icon="mdi-human-handsup" :nav-text="$t('common:navigation.commitments')">
            </nav-item>
            <nav-item nuxt-link="event" icon="mdi-calendar" :nav-text="$t('common:navigation.events')"></nav-item>
        </div>
        <v-divider></v-divider>
        <div class="common-navigation">
            <nav-item nuxt-link="login" icon="mdi-login" :nav-text="$t('common:toolbar.login')"
                      v-if="!isAuthenticated"></nav-item>
            <div v-else>
                <nav-item nuxt-link="user" icon="mdi-account-outline"
                          :nav-text="$t('common:navigation.yourProfile')"></nav-item>
                <nav-item nuxt-link="notifications" icon="mdi-bell-outline" :badge-count="numberOfUnreadNotifications"
                          :nav-text="$t('common:navigation.notification')"></nav-item>
            </div>
        </div>
        <v-divider></v-divider>
        <v-btn v-if="isQuestionDetail" color="primary" class="create-button" rounded
               @click="$emit('show-create-answer-dialog')">
            <v-icon dark>mdi-forum</v-icon>
            {{$t('common:toolbar.answerQuestion')}}
        </v-btn>
        <v-btn color="primary" class="create-button" :class="{'second-created-button':isQuestionDetail}" rounded
               @click="$emit('show-create-question-dialog')"
               :outlined="isQuestionDetail">
            <v-icon dark>mdi-plus</v-icon>
            {{$t('common:toolbar.askQuestion')}}
        </v-btn>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import NavItem from "./NavItem";

    export default {
        name: "Drawer",
        components: {NavItem},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            logo() {
                return `${process.env.staticUrl}/img/logo_blue.png`;
            },
            isQuestionDetail() {
                return this.$route.name === 'question-questionId-slug';
            },
            ...mapGetters({
                numberOfUnreadNotifications: 'notification/numberOfUnreadNotifications'
            })
        }
    }
</script>

<style lang="scss">
    #navigation-drawer {

        #dumonda-me-logo-container {
            width: 100%;
            padding: 24px 70px;

            img {
                width: 100%;
            }
        }

        .navigation-button-full-width {
            margin: 0 0 18px 0;
            width: 100%;
        }

        .common-navigation {
            margin-top: 18px;
            margin-bottom: 18px;
            padding-left: 8px;
            padding-right: 8px;
        }

        .create-button {
            margin-top: 24px;
            margin-left: 8px;

            .v-btn__content {
                width: 208px;
                justify-content: left;

                .v-icon {
                    margin-left: -6px;
                    margin-right: 28px;
                }
            }
        }

        .create-button.second-created-button {
            margin-top: 16px;
        }
    }
</style>