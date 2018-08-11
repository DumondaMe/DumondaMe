<template>
    <div class="select-region-container">
        <div class="select-region" @click="showDialog = true">
            <span v-if="localSelectedRegion.id === 'international'">{{localSelectedRegion.description}}</span>
            <span v-else>{{$t("common:region")}}: {{localSelectedRegion.description}}</span>
        </div>
        <v-layout row justify-center v-if="showDialog">
            <v-dialog v-model="showDialog" scrollable persistent max-width="650px">
                <region @close-dialog="showDialog = false" @finish="changeRegion" :select-multiple="false"
                        :existing-regions="[localSelectedRegion]" :action-button-text="$t('common:button.change')"
                        :description="$t('pages:feeds.filter.region.selectDialogDescription')" :loading="loading">
                </region>
            </v-dialog>
            <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
                <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
            </v-snackbar>
        </v-layout>
    </div>
</template>

<script>
    import Region from '~/components/region/dialog/Region';

    export default {
        props: ['selectedRegion'],
        components: {Region},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        data: function () {
            return {
                showDialog: false, showError: false, loading: false,
                localSelectedRegion: JSON.parse(JSON.stringify(this.selectedRegion))
            }
        },
        methods: {
            changeRegion(selectedRegion) {
                this.showDialog = false;
                this.localSelectedRegion = selectedRegion[0];
            }
        }
    }
</script>

<style lang="scss">
    .select-region-container {
        display: inline-block;
        .select-region {
            height: 26px;
            line-height: 26px;
            display: inline-block;
            margin-right: 12px;
            color: $secondary-text;
            font-size: 14px;
            cursor: pointer;
        }

        :hover.select-region {
            color: $primary-text;
        }
    }
</style>
