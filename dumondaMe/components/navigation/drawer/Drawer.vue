<template>
    <div id="navigation-drawer">
        <div id="dumonda-me-logged-in-user" v-if="isAuthenticated">
            <img :src="userImage" @click="$router.push({name: 'user'})">
            <div class="user-icon-container">
                <div class="user-icon" @click="$router.push({name: 'user'})"
                     :class="{'is-actual-route': $route.name === 'user'}">
                    <v-icon size="28">mdi-account-outline</v-icon>
                </div>
                <div class="user-icon" @click="$router.push({name: 'notifications'})"
                     :class="{'is-actual-route': $route.name === 'notifications'}">
                    <v-badge overlap color="secondary" v-model="showNumberOfUnreadNotifications">
                        <template v-slot:badge>{{numberOfUnreadNotifications}}</template>
                        <v-icon size="28" >mdi-bell-outline</v-icon>
                    </v-badge>
                </div>
            </div>
        </div>
        <div id="dumonda-me-logo-container" v-else>
            <img :src="logo" @click="$router.push({name: 'topics'})">
        </div>
        <v-btn color="primary" class="create-button" rounded @click="$emit('show-create-question-dialog')">
            <v-icon dark>mdi-plus</v-icon>
            {{$t('common:toolbar.askQuestion')}}
        </v-btn>
        <div class="common-navigation">
            <nav-item v-if="isAuthenticated" nuxt-link="index" icon="mdi-heart-pulse"
                      :nav-text="$t('common:navigation.activities')" :query="filterQuery"></nav-item>
            <nav-item nuxt-link="topics" icon="mdi-book-outline" :nav-text="$t('common:navigation.topics')"></nav-item>
            <nav-item nuxt-link="question" icon="mdi-help" :nav-text="$t('common:navigation.questions')"
                      :query="filterQuery"></nav-item>
            <nav-item nuxt-link="commitment" icon="mdi-human-handsup" :nav-text="$t('common:navigation.commitments')"
                      :query="filterQuery">
            </nav-item>
            <nav-item nuxt-link="event" icon="mdi-calendar" :nav-text="$t('common:navigation.events')"
                      :query="filterQuery"></nav-item>
        </div>
        <v-divider></v-divider>
        <div class="common-navigation">
            <nav-item nuxt-link="about" icon="mdi-information-outline"
                      :nav-text="$t('common:navigation.aboutDumondaMe')"></nav-item>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import NavItem from "./NavItem";

    export default {
        name: "Drawer",
        components: {NavItem},
        async mounted() {
            if (this.$store.state.auth.userIsAuthenticated) {
                let response = await this.$axios.$get('user/profile/image');
                this.$store.commit('user/SET_USER_IMAGE', response.profileImage);
            }
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            userImage() {
                return this.$store.state.user.userImage
            },
            showNumberOfUnreadNotifications() {
                return this.numberOfUnreadNotifications > 0;
            },
            logo() {
                return `${process.env.staticUrl}/img/logo_blue.png`;
            },
            filterQuery() {
                if (this.$store.state.feedFilter.filterActive) {
                    return {topic: this.$store.state.feedFilter.topicFilter.map(topic => topic.id)};
                }
            },
            isHarvestingUser() {
                return this.$store.state.user.isHarvestingUser;
            },
            userId() {
                return this.$store.state.user.userId;
            },
            ...mapGetters({
                numberOfUnreadNotifications: 'notification/numberOfUnreadNotifications'
            })
        }
    }
</script>

<style lang="scss">
    #navigation-drawer {

        #dumonda-me-logged-in-user {
            padding-top: 24px;
            padding-bottom: 24px;

            img {
                display: block;
                width: 90px;
                height: 90px;
                border-radius: 50%;
                margin: 0 auto;
                cursor: pointer;
            }

            .user-icon-container {
                display: flex;
                justify-content: center;
                margin-top: 16px;

                .user-icon {
                    margin: 0 18px;
                    cursor: pointer;
                }

                .user-icon.is-actual-route {
                    .v-icon {
                        color: $primary-color;
                    }
                }
            }
        }

        #dumonda-me-logo-container {
            width: 100%;
            padding: 24px 70px;

            img {
                cursor: pointer;
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
            margin-left: 12px;
            margin-bottom: 6px;

            .v-btn__content {
                width: 200px;
                justify-content: left;
                font-size: 16px;
                letter-spacing: 0.5px;

                .v-icon {
                    margin-left: -10px;
                    margin-right: 28px;
                }
            }
        }
    }
</style>