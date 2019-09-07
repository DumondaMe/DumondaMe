<template>
    <div id="commitment-admin-commands-container">
        <div id="admin-commands">
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn small fab color="secondary" v-on="on">
                        <v-icon size="20">mdi-pencil</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="showModifyCommitmentDialog = true">
                        <v-list-item-title>{{$t("common:commitment")}}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="showEditRegionDialog = true">
                        <v-list-item-title>{{$t("common:region")}}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="showModifyTopicDialog = true">
                        <v-list-item-title>{{$t("common:topic")}}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="showAdminDialog = true">
                        <v-list-item-title>{{$t("common:admin")}}</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="showDeleteCommitmentDialog = true">
                        <v-list-item-title>{{$t("common:button.delete")}}</v-list-item-title>
                    </v-list-item>
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
