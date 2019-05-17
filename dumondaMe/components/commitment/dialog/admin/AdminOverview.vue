<template>
    <v-card id="dialog-admin-commitment-overview">
        <div>
            <div id="dumonda-me-dialog-header">
                {{$t('pages:detailCommitment.adminDialog.title', getTitle())}}
            </div>
            <v-divider></v-divider>
        </div>
        <v-card-text id="dialog-admin-commitment-overview-content" class="mobile-dialog-content">
            <admin v-for="admin in admins" :key="admin.userId" :admin="admin"
                   :disable-remove-button="disableRemoveButton"></admin>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn @click="$emit('add-admin')" color="primary">
                <v-icon left>mdi-account-plus</v-icon>
                {{$t("pages:detailCommitment.adminDialog.addAdminButton")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import Admin from './Admin';

    export default {
        props: ['admins', 'disableRemoveButton'],
        data() {
            return {}
        },
        components: {Admin},
        methods: {
            getTitle() {
                return JSON.parse(JSON.stringify({commitment: this.$store.getters['commitment/getCommitment'].title}));
            }
        },
    }
</script>

<style lang="scss">
    #dialog-admin-commitment-overview {
        max-width: 650px;

        #dialog-admin-commitment-overview-content {
            max-width: 650px;
        }
    }
</style>
