<template>
    <div id="dumonda-me-regions-overview">
        <v-btn color="primary" @click="showCreateRegionDialog = true" id="create-region-button">
            <v-icon left>mdi-plus-box-outline</v-icon>
            {{$t('pages:regions.createRegionDialog')}}
        </v-btn>
        <region :region="region" v-for="region in topRegions" :key="region.regionId" :is-top-region="true"
                :class="{'is-sub-region-expanded': region.regions && region.regions.length > 0}"></region>
        <create-region-dialog v-if="showCreateRegionDialog" @close-dialog="showCreateRegionDialog = false">
        </create-region-dialog>
    </div>
</template>

<script>
    import CreateRegionDialog from '~/components/regions/dialog/CreateRegion'
    import Region from './Region';

    export default {
        data() {
            return {showCreateRegionDialog: false}
        },
        components: {CreateRegionDialog, Region},
        computed: {
            topRegions() {
                return this.$store.state.regions.regions;
            },
            getLanguage() {
                return this.$store.state.i18n.language
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    #dumonda-me-regions-overview {
        #create-region-button {
            margin-left: 0;
            margin-bottom: 18px;
        }
        .is-sub-region-expanded {
            margin-bottom: 50px;
        }
    }
</style>
