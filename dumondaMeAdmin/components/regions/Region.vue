<template>
    <div class="dumonda-me-region-container">
        <div class="dumonda-me-region ely-card" :class="{'is-top-region': isTopRegion}">
            <h2>{{region[getLanguage]}}</h2>
            <div class="region-content">
                <div class="region-info">RegionId: {{region.regionId}}
                    <span class="number-of-sub-regions">{{$t('pages:regions.numberOfSubRegions',
                    {count: region.numberOfSubRegions})}}</span></div>
                <div class="region-description-content">
                    <div class="language-description">
                        <span class="bold-description">{{$t('common:language.de')}}:</span> {{region.de}}
                    </div>
                </div>
                <div class="region-description-content">
                    <div class="language-description">
                        <span class="bold-description">{{$t('common:language.en')}}:</span> {{region.en}}
                    </div>
                </div>
            </div>
            <div class="region-commands">
                <v-btn outline color="primary" @click="showEditRegionDialog = true">
                    {{$t('pages:regions.editRegionDialog')}}
                </v-btn>
                <v-btn outline color="primary" @click="showAddRegionDialog = true">
                    {{$t('pages:regions.addSubRegionDialog')}}
                </v-btn>
                <v-btn outline color="primary" @click="getSubRegions"
                       :disabled="region.numberOfSubRegions === 0 || showSubRegions">
                    {{$t('pages:regions.showSubRegions')}}
                </v-btn>
            </div>
            <edit-region-dialog v-if="showEditRegionDialog" @close-dialog="showEditRegionDialog = false"
                                 :init-region="region" :init-parent-region-id="region.parentRegionId">
            </edit-region-dialog>
            <create-region-dialog v-if="showAddRegionDialog" @close-dialog="showAddRegionDialog = false"
                                     :init-parent-region-id="region.regionId">
            </create-region-dialog>
        </div>
        <div v-if="showSubRegions" class="sub-regions-container">
            <div v-for="subRegion in region.regions" :key="subRegion.regionId">
                <region :region="subRegion"></region>
            </div>
        </div>
    </div>
</template>

<script>
    import EditRegionDialog from '~/components/regions/dialog/EditRegion';
    import CreateRegionDialog from '~/components/regions/dialog/CreateRegion';
    import Region from './Region';

    export default {
        name: 'region',
        props: ['region', 'isTopRegion'],
        components: {EditRegionDialog, CreateRegionDialog, Region},
        data() {
            return {showEditRegionDialog: false, showAddRegionDialog: false, showSubRegions: false}
        },
        computed: {
            getLanguage() {
                return this.$store.state.i18n.language
            }
        },
        methods: {
            async getSubRegions() {
                await this.$store.dispatch('regions/getSubRegions', this.region.regionId);
                this.showSubRegions = true;
            }
        }
    }
</script>

<style lang="scss">
    .dumonda-me-region-container {
        .dumonda-me-region {
            margin-bottom: 18px;
            h2 {
                font-weight: 500;
            }
            .region-content {
                font-size: 14px;
                .region-info {
                    margin-bottom: 12px;
                    .number-of-sub-regions {
                        cursor: pointer;
                        margin-left: 18px;
                    }
                    :hover.number-of-sub-regions {
                        text-decoration: underline;
                    }
                }
                .region-description-content {
                    margin-top: 4px;
                    .language-description {
                        margin-right: 8px;
                        min-width: 180px;
                        display: inline-block;
                    }
                    .bold-description {
                        font-weight: 500;
                    }
                    .similar-description {
                        margin-left: 12px;
                    }
                }
            }
            .region-commands {
                margin-top: 18px;
                button {
                    margin-left: 0;
                }
            }
        }
        .sub-regions-container {
            margin-left: 42px;
        }
        .ely-card.is-top-region {
            border: 1px solid green;
        }
    }
</style>
