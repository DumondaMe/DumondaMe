<template>
    <div id="elyoos-commitment-header">
        <h1>{{commitment.title}}</h1>
        <p id="commitment-description">{{commitment.description}}</p>
        <div id="commands-container">
            <v-btn class="button-watch" color="primary" small fab @click="addWatch"
                   v-if="!commitment.userWatchesCommitment" :disabled="isAdmin">
                <v-icon>mdi-star-outline</v-icon>
            </v-btn>
            <v-btn class="button-watch" color="primary" small fab @click="removeWatch" :disabled="isAdmin" v-else>
                <v-icon>mdi-star</v-icon>
            </v-btn>
            <span class="description">{{commitment.numberOfWatches}}</span>
            <admin-commands v-if="isAdmin"></admin-commands>
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
                display: inline-block;
                margin-left: 0;
            }
            .description {
                height: 40px;
                line-height: 40px;
                display: inline-block;
                font-size: 16px;
                font-weight: 500;
                color: $secondary-text;
                margin-left: 4px;
                margin-right: 20px;
                vertical-align: middle;
            }
        }
    }
</style>
