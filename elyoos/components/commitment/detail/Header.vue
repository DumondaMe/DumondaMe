<template>
    <div id="elyoos-commitment-header">
        <div id="commitment-image">
            <img :src="commitment.imageUrl"/>
            <div id="button-watch-container">
                <v-btn class="button-watch" color="primary" outline @click="addWatch"
                       v-if="!commitment.userWatchesCommitment" :disabled="isAdmin">
                    <v-icon>mdi-eye</v-icon>
                    {{$t("common:button.watch")}}
                </v-btn>
                <v-btn class="button-watch" color="primary" outline @click="removeWatch" v-else>
                    <v-icon>mdi-check</v-icon>
                    {{$t("common:button.watch")}}
                </v-btn>
            </div>
        </div>
        <div id="commitment-infos">
            <h1>{{commitment.title}}</h1>
            <p id="commitment-description">{{commitment.description}}</p>
        </div>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired.vue';
    import {mapGetters} from 'vuex';

    export default {
        components: {LoginRequiredDialog},
        data() {
            return {showLoginRequired: false}
        },
        computed: {
            isAdmin() {
                return this.$store.state.commitment.commitment.isAdmin;
            },
            ...mapGetters({commitment: 'commitment/getCommitment'})
        },
        methods: {
            async addWatch() {
                if (this.$store.state.auth.userIsAuthenticated) {
                    await this.$axios.$put(`user/commitment/watch/${this.$route.params.commitmentId}`);
                    this.$store.commit('commitment/SET_WATCH')
                } else {
                    this.showLoginRequired = true;
                }
            },
            async removeWatch() {
                if (this.$store.state.auth.userIsAuthenticated) {
                    await this.$axios.$delete(`user/commitment/watch/`,
                        {params: {commitmentId: this.$route.params.commitmentId}});
                    this.$store.commit('commitment/REMOVE_WATCH')
                } else {
                    this.showLoginRequired = true;
                }
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-commitment-header {
        padding-bottom: 8px;
        #commitment-image {
            float: left;
            width: 142px;
            img {
                width: 100%;
                border-radius: 6px;
            }
            #button-watch-container {
                width: 142px;
                margin-top: 8px;
                .button-watch {
                    width: 142px;
                    margin: 0 auto;
                    .icon {
                        margin-right: 8px;
                    }
                }
            }
        }
        #commitment-infos {
            margin-left: 142px;
            padding-left: 32px;
            min-height: 142px;
            h1 {
                margin-bottom: 4px;
                font-size: 28px;
                line-height: 28px;
            }
            #commitment-description {
                margin-top: 12px;
                font-size: 16px;
                font-weight: 300;
                white-space: pre-line;
                word-break: break-word;
            }
        }
    }
</style>
