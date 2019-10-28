<template>
    <div id="search-harvesting-users-container">
        <h2 class="user-profile-title">{{$t("pages:search.harvestingUsers.title")}}</h2>
        <div class="user-container ely-card" v-for="(user, index) of users"
             :class="{'last-card-element': index === users.length - 1}">
            <div class="user-preview-img" @click="goToProfile(user)">
                <img :src="user.userImage">
            </div>
            <div class="user-content">
                <div class="user-name" @click="goToProfile(user)">
                    {{user.name}}
                </div>
                <div class="date">{{user.start | formatFromToDate(user.end, $t('common:at'))}}</div>
                <expand-text class="description" :expand-text="user.description">
                </expand-text>
            </div>
        </div>
        <v-btn outlined color="primary" v-if="hasMoreUsers" class="has-more-button" @click="getNextHarvestingUsers"
               :loading="loadingNextUsers" :disabled="loadingNextUsers">
            {{$t('common:button.showMore')}}
        </v-btn>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        data() {
            return {loading: false, loadingNextUsers: false, showError: false}
        },
        components: {ExpandText},
        methods: {
            goToProfile(user) {
                if (user.isLoggedInUser) {
                    this.$router.push({name: 'user'});
                } else {
                    this.$router.push({
                        name: 'user-userId-slug',
                        params: {userId: user.userId, slug: user.slug}
                    });
                }
            },
            async getNextHarvestingUsers() {
                try {
                    this.loadingNextUsers = true;
                    await this.$store.dispatch('search/searchNextHarvestingUsers');
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.loadingNextUsers = false;
                }
            }
        },
        computed: {
            users() {
                return this.$store.state.search.harvestingUsers;
            },
            hasMoreUsers() {
                return this.$store.state.search.hasMoreHarvestingUsers;
            }
        }
    }
</script>

<style lang="scss">
    #search-harvesting-users-container {
        margin-bottom: 38px;
        @media screen and (max-width: $xs) {
            padding-bottom: 12px;
            margin-bottom: 20px;
            border-bottom: 1px solid $divider;
        }

        .user-profile-title {
            font-size: 22px;
            margin-bottom: 18px;
            @media screen and (max-width: $xs) {
                display: none;
            }
        }

        .user-container {
            display: flex;
            margin-bottom: 16px;
            @include defaultPaddingCard();

            @media screen and (max-width: $xs) {
                padding-bottom: 12px;
                margin-bottom: 0;
            }

            .user-preview-img {
                cursor: pointer;
                width: 100px;
                height: 100px;
                min-width: 100px;

                img {
                    width: 100%;
                    border-radius: 4px;
                }
            }

            .user-content {
                position: relative;
                margin-left: 18px;
                min-height: 100px;

                .user-name {
                    cursor: pointer;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 16px;
                    line-height: 18px;
                    font-weight: 400;
                    color: $primary-color;
                }

                :hover.user-name {
                    text-decoration: underline;
                }

                .date {
                    font-size: 14px;
                    color: $secondary-text;
                }

                .expand-text-container.description {
                    margin-top: 8px;
                    font-weight: 300;

                    p {
                        white-space: normal;
                    }
                }
            }
        }

        .user-container.last-card-element {
            @media screen and (max-width: $xs) {
                border-bottom: none;
            }
        }

        .has-more-button {
            margin-left: 0;
            @media screen and (max-width: $xs) {
                margin-left: 16px;
            }
        }
    }
</style>
