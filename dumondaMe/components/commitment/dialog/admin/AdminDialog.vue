<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <add-admin v-if="showAddAdmin" :commitmentId="commitmentId"
                       @close-dialog="showAddAdmin = false">
            </add-admin>
            <admin-overview v-else :disable-remove-button="admins.length < 2"
                            :admins="admins" :admins-requested="adminsRequested" @close-dialog="$emit('close-dialog')"
                            @add-admin="showAddAdmin = true">
            </admin-overview>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import AddAdmin from './AddAdmin';
    import AdminOverview from './AdminOverview';

    export default {
        props: ['commitmentId'],
        data() {
            return {dialog: true, showError: false, showAddAdmin: false}
        },
        components: {AddAdmin, AdminOverview},
        async mounted() {
            await this.$store.dispatch('commitment/getAdmins');
        },
        computed: {
            admins() {
                return this.$store.state.commitment.admins;
            },
            adminsRequested() {
                return this.$store.state.commitment.adminsRequested;
            }
        }
    }
</script>

<style lang="scss">

</style>
