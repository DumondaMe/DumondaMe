<template>
    <div class="select-region">
        <div class="region-container" @click="select()"
             :class="{'region-selected': region.isSelected, 'sub-region-selected': region.subRegionIsSelected}">
            <v-icon class="region-icon" v-show="region.isSelected">done</v-icon>
            <div class="region" :class="{'main-bold': isTopRegion}">
                {{$t("regions:" + region.code)}}
            </div>
        </div>
        <div class="sub-regions" v-if="(region.isSelected || (region.subRegionIsSelected)) &&
                                        region.subRegions.length > 0">
            <select-region-element :region="subRegion" v-for="subRegion in region.subRegions"
                                   :key="subRegion.code" :is-top-region="false" :select-multiple="selectMultiple">
            </select-region-element>
        </div>
    </div>
</template>

<script>
    import SelectRegionElement from './RegionElement';

    export default {
        name: 'select-region-element',
        props: ['region', 'isTopRegion', 'selectMultiple'],
        components: {SelectRegionElement},
        methods: {
            select() {
                if (this.selectMultiple) {
                    this.$store.commit('selectRegions/SELECT_CHANGED', this.region.code);
                } else {
                    this.$store.commit('selectRegion/SELECT_CHANGED', this.region.code);
                }
            }
        }
    }
</script>

<style lang="scss">
    .select-region {
        .region-container {
            padding: 8px 12px;
            border-bottom: 1px solid $divider;
            cursor: pointer;
            .region-icon {
                float: right;
                color: $success-text;
            }
            .region {
            }
            .region.main-bold {
                font-weight: 500;
            }
        }
        :hover.region-container {
            background-color: #EEEEEE;
        }
        .region-selected {
            font-weight: 500;
            color: $success-text;
            background-color: #EEEEEE;
        }
        .sub-region-selected {
            font-weight: 500;
            background-color: #EEEEEE;
        }
    }
</style>
