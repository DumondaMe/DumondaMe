<template>
    <div id="search-commitments-no-result-container">
        <h2 class="user-profile-title">{{$t("pages:search.commitments.title")}}</h2>
        <div class="no-user-description">{{$t("pages:search.commitments.noCommitmentDescription")}}</div>
        <v-btn color="primary" @click="openCreateCommitmentDialog">
            {{$t('pages:search.commitments.createNewCommitment')}}
        </v-btn>
        <create-commitment-dialog v-if="showCreateCommitmentDialog" @close-dialog="showCreateCommitmentDialog = false">
        </create-commitment-dialog>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import CreateCommitmentDialog from '~/components/commitment/dialog/CreateDialog.vue';

    export default {
        data() {
            return {showCreateCommitmentDialog: false, showLoginRequired: false}
        },
        components: {LoginRequiredDialog, CreateCommitmentDialog},
        methods: {
            openCreateCommitmentDialog() {
                if (this.isAuthenticated) {
                    this.showCreateCommitmentDialog = true;
                } else {
                    this.showLoginRequired = true;
                }
            }
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        }
    }
</script>

<style lang="scss">
    #search-commitments-no-result-container {
        margin-bottom: 38px;

        h2 {
            font-size: 22px;
            margin-bottom: 12px;
        }

        button {
            margin-left: 0;
            margin-top: 12px;
        }
    }
</style>
