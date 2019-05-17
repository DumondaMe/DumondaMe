<template>
    <div id="commitment-admin-commands-container">
        <div id="admin-commands">
            <v-menu offset-y>
                <v-btn small fab color="secondary" slot="activator">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-list>
                    <v-list-tile @click="showModifyCommitmentDialog = true">
                        <v-list-tile-title>{{$t("common:commitment")}}</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="showEditRegionDialog = true">
                        <v-list-tile-title>{{$t("common:region")}}</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="showModifyTopicDialog = true">
                        <v-list-tile-title>{{$t("common:topic")}}</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="showAdminDialog = true">
                        <v-list-tile-title>{{$t("common:admin")}}</v-list-tile-title>
                    </v-list-tile>
                    <v-divider></v-divider>
                    <v-list-tile @click="showDeleteCommitmentDialog = true">
                        <v-list-tile-title>{{$t("common:button.delete")}}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </div>
        <modify-commitment-dialog v-if="showModifyCommitmentDialog" @close-dialog="showModifyCommitmentDialog = false"
                                  @finish="showModifyCommitmentDialog = false">
        </modify-commitment-dialog>
        <modify-topic-dialog v-if="showModifyTopicDialog" @close-dialog="showModifyTopicDialog = false"
                             @finish="topicsChanged"
                             :title-text="$t('pages:commitment.modifyTopicDialog.title', {commitment: commitment.title})"
                             :existing-topics="commitment.topics" api="user/commitment/topic/"
                             :api-param="$route.params.commitmentId">
        </modify-topic-dialog>
        <delete-commitment-dialog :commitment="commitment.title" :commitment-id="$route.params.commitmentId"
                                  v-if="showDeleteCommitmentDialog" @close-dialog="showDeleteCommitmentDialog = false">
        </delete-commitment-dialog>
        <edit-region-dialog v-if="showEditRegionDialog" @close-dialog="showEditRegionDialog = false"
                            :select-multiple="true" hide-item="international"
                            :title-text="$t('pages:commitment.editRegionDialog.title', {commitment: commitmentTitle})"
                            :existing-regions="commitment.regions" api="user/commitment/region/"
                            :api-param="$route.params.commitmentId" @finish="regionsChanged">
        </edit-region-dialog>
        <admin-dialog v-if="showAdminDialog" :commitment-id="$route.params.commitmentId"
                      @close-dialog="showAdminDialog = false">

        </admin-dialog>
    </div>
</template>

<script>
    import ModifyCommitmentDialog from '~/components/commitment/dialog/ModifyCommitmentDialog';
    import DeleteCommitmentDialog from '~/components/commitment/dialog/DeleteCommitmentDialog';
    import ModifyTopicDialog from '~/components/topic/dialog/ModifyTopicDialog';
    import EditRegionDialog from '~/components/region/dialog/EditRegionDialog';
    import AdminDialog from '~/components/commitment/dialog/admin/AdminDialog';

    export default {
        components: {ModifyCommitmentDialog, DeleteCommitmentDialog, ModifyTopicDialog, EditRegionDialog, AdminDialog},
        data() {
            return {
                showModifyCommitmentDialog: false, showDeleteCommitmentDialog: false, showModifyTopicDialog: false,
                showEditRegionDialog: false, showAdminDialog: false
            }
        },
        computed: {
            commitment() {
                return this.$store.state.commitment.commitment;
            },
            commitmentTitle() {
                return `<span class="title-element-primary">${this.commitment.title}</span>`
            }
        },
        methods: {
            topicsChanged(topics) {
                this.showModifyTopicDialog = false;
                this.$store.commit('commitment/SET_TOPICS', topics);
            },
            regionsChanged(topics) {
                this.showEditRegionDialog = false;
                this.$store.commit('commitment/SET_REGIONS', topics);
            }
        }
    }
</script>

<style lang="scss">
    #commitment-admin-commands-container {
        display: inline-block;
    }
</style>
