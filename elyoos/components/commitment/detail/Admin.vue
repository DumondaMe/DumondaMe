<template>
    <div class="sidebar-container">
        <h3>{{$t("pages:detailCommitment.admin.title")}}</h3>
        <div id="commitment-admin-container">
            <p>{{$t("pages:detailCommitment.admin.description")}}</p>
            <div id="admin-commands">
                <v-menu bottom left offset-y>
                    <v-btn outline fab small color="primary" slot="activator">
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
                    </v-list>
                </v-menu>
                <v-btn outline fab small color="primary" @click.native="showDeleteCommitmentDialog = true">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </div>
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
                            :title-text="$t('pages:commitment.editRegionDialog.title', {commitment: commitmentTitle})"
                            :existing-regions="commitment.regions" api="user/commitment/region/"
                            :api-param="$route.params.commitmentId" @finish="regionsChanged">
        </edit-region-dialog>
    </div>
</template>

<script>
    import ModifyCommitmentDialog from '~/components/commitment/dialog/ModifyCommitmentDialog';
    import DeleteCommitmentDialog from '~/components/commitment/dialog/DeleteCommitmentDialog';
    import ModifyTopicDialog from '~/components/topic/dialog/ModifyTopicDialog';
    import EditRegionDialog from '~/components/region/dialog/EditRegionDialog';

    export default {
        components: {ModifyCommitmentDialog, DeleteCommitmentDialog, ModifyTopicDialog, EditRegionDialog},
        data() {
            return {
                showModifyCommitmentDialog: false, showDeleteCommitmentDialog: false, showModifyTopicDialog: false,
                showEditRegionDialog: false
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
    #commitment-admin-container {
        p {
            font-size: 14px;
            font-weight: 300;
            margin-bottom: 6px;
        }
        #admin-commands {
            button {
                margin-left: 0;
                margin-right: 16px;
            }
        }
    }
</style>
