<template>
    <div class="harvesting-profile-general-information ely-card">
        <div class="user-profile-info">
            <v-icon size="20" class="info-icon">$vuetify.icons.mdiLink</v-icon>
            <a target="_blank" rel="noopener" :href="user.link">{{website}}</a>
        </div>
        <div class="user-profile-info" v-if="user.address">
            <v-icon size="20" class="info-icon">$vuetify.icons.mdiMapMarker</v-icon>
            <div>{{user.address}}</div>
        </div>
        <div class="user-profile-info">
            <v-icon size="20" class="info-icon">$vuetify.icons.mdiCalendar</v-icon>
            <div>{{user.start | formatFromToDate(user.end, $t('common:at'), $t('common:to'))}}</div>
        </div>
    </div>
</template>

<script>
    import language from '~/mixins/languages.js';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [language],
        computed: {
            user() {
                return this.$store.state.userProfile.user;
            },
            website() {
                return this.user.link.replace(/(^\w+:|^)\/\//, '')
            },
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            ...mapGetters({isLoggedInUser: 'userProfile/isLoggedInUser'})
        }
    }
</script>

<style lang="scss">
    .harvesting-profile-general-information {
        margin-top: 18px;
        @include defaultPaddingCard();

        .user-profile-info {
            display: flex;
            font-size: 16px;
            margin-bottom: 6px;
            font-weight: 300;
            width: 100%;

            .info-icon {
                align-items: flex-start;
                margin-top: 2px;
                margin-right: 12px;
                color: #90A4AE;
            }

            a {
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }
        }
    }
</style>
