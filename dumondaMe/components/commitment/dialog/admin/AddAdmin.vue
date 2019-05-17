<template>
    <v-card id="dialog-add-admin-commitment">
        <div>
            <div id="dumonda-me-dialog-header">
                {{$t('pages:detailCommitment.adminDialog.titleAddAdmin', getTitle())}}
            </div>
            <v-divider></v-divider>
        </div>
        <v-card-text id="dialog-add-admin-commitment-content" class="mobile-dialog-content">
            <v-text-field v-model="userQuery"
                          :label="$t('pages:detailCommitment.adminDialog.searchAdmin')"
                          :rules="[ruleToManyChars($t('validation:toManyChars'), 255)]">
            </v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click.native="$emit('close-dialog')">
                {{$t("common:button.abort")}}
            </v-btn>
            <v-btn color="primary" @click.native="$emit('close-dialog')">
                <v-icon left>mdi-account-plus</v-icon>
                {{$t("pages:detailCommitment.adminDialog.addAdminButton")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['commitmentId'],
        data() {
            return {userQuery: ''}
        },
        components: {},
        mixins: [validationRules],
        methods: {
            getTitle() {
                return JSON.parse(JSON.stringify({commitment: this.$store.getters['commitment/getCommitment'].title}));
            }
        },
    }
</script>

<style lang="scss">
    #dialog-add-admin-commitment{
        max-width: 650px;

        #dialog-add-admin-commitment-content {
            max-width: 650px;

        }
    }
</style>
