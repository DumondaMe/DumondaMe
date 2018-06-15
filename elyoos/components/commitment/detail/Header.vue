<template>
    <div id="elyoos-commitment-header">
        <h1>{{commitment.title}}</h1>
        <p id="commitment-description">{{commitment.description}}</p>
        <admin-commands v-if="isAdmin"></admin-commands>
        <div id="commands-container" v-else>
            <v-btn class="button-watch" color="primary" outline @click="addWatch"
                   v-if="!commitment.userWatchesCommitment">
                <v-icon>mdi-star</v-icon>
                {{$t("common:button.interested")}}
            </v-btn>
            <v-btn class="button-watch" color="primary" outline @click="removeWatch" v-else>
                <v-icon>mdi-check</v-icon>
                {{$t("common:button.interested")}}
            </v-btn>
        </div>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired.vue';
    import AdminCommands from './AdminCommands';
    import {mapGetters} from 'vuex';

    export default {
        components: {LoginRequiredDialog, AdminCommands},
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
        h1 {
            margin-bottom: 4px;
            font-weight: 300;
            font-size: 32px;
            line-height: 32px;
        }
        #commitment-description {
            margin-top: 12px;
            font-size: 16px;
            font-weight: 300;
            white-space: pre-line;
            word-break: break-word;
        }
        #commands-container {
            .button-watch {
                margin-left: 0;
                i.icon {
                    font-size: 20px;
                    margin-right: 8px;
                }
            }
        }
    }
</style>
