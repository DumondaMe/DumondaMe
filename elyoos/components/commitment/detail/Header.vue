<template>
    <div id="elyoos-commitment-header">
        <h1>{{commitment.title}}</h1>
        <p id="commitment-description">{{commitment.description}}</p>
        <div id="commands-container">
            <watches-menu :watched-id="commitment.commitmentId" watched-id-name="commitmentId" class="watches-menu"
                          :is-logged-in-user="true" :is-watching-action="false"
                          :is-admin="isAdmin"
                          :watched-by-user="commitment.userWatchesCommitment"
                          :number-of-watches="commitment.numberOfWatches"
                          menu-translation="watchesCommitment" api-get-user-command="commitment/watches"
                          api-watch="user/commitment/watch"
                          @add-watch="addWatch" @remove-watch="removeWatch">
                <div slot="icon">
                    <v-btn class="button-watch" color="primary" small fab slot="activator"
                           v-if="!commitment.userWatchesCommitment" :disabled="isAdmin">
                        <v-icon>mdi-star-outline</v-icon>
                    </v-btn>
                    <v-btn class="button-watch" color="user-watches-commitment" small fab :disabled="isAdmin"
                           v-else slot="activator">
                        <v-icon>mdi-star</v-icon>
                    </v-btn>
                    <span class="description">{{commitment.numberOfWatches}}</span>
                </div>
            </watches-menu>
            <admin-commands v-if="isAdmin"></admin-commands>
        </div>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired.vue';
    import WatchesMenu from '~/components/feed/card/footer/menu/Watches';
    import AdminCommands from './AdminCommands';
    import {mapGetters} from 'vuex';

    export default {
        components: {LoginRequiredDialog, WatchesMenu, AdminCommands},
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
                this.$store.commit('commitment/SET_WATCH');
            },
            async removeWatch() {
                this.$store.commit('commitment/REMOVE_WATCH');
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
            .user-watches-commitment {
                background-color: #607D8B;
                i.v-icon {
                    color: white;
                }
            }
            .watches-menu {
                display: inline-block;
            }
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
