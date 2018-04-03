<template>
    <div class="select-region">
        <div class="region-container" :class="{'region-selected': selected}" @click="select()">
            <v-icon class="region-icon" v-show="selected">done</v-icon>
            <div class="region" :class="{'main-bold': isTopRegion}">
                {{$t("regions:" + region.code)}}
            </div>
        </div>
        <div class="sub-regions" v-if="(selected || (numberOfSubRegionsSelected > 0 && !isTopRegion)) &&
                                        region.subRegions.length > 0">
            <select-region-element :region="subRegion" v-for="subRegion in region.subRegions"
                                   :key="subRegion.code" :top-region="topRegion" :is-top-region="false"
                                   @selected="forwardSelected" @unselected="forwardUnselected">
            </select-region-element>
        </div>
    </div>
</template>

<script>
    import SelectRegionElement from './RegionElement';

    export default {
        name: 'select-region-element',
        props: ['region', 'topRegion', 'isTopRegion'],
        components: {SelectRegionElement},
        data() {
            return {selected: false, numberOfSubRegionsSelected: 0}
        },
        methods: {
            select() {
                this.selected = !this.selected;
                if (this.selected) {
                    this.$emit('selected', {
                        code: this.region.code, topRegion: this.topRegion,
                        isTopRegion: this.isTopRegion
                    });
                } else {
                    this.$emit('unselected', {
                        code: this.region.code, topRegion: this.topRegion,
                        isTopRegion: this.isTopRegion
                    });
                }
            },
            forwardSelected(region) {
                this.$emit('selected', region);
                this.numberOfSubRegionsSelected++;
            },
            forwardUnselected(region) {
                this.$emit('unselected', region);
                this.numberOfSubRegionsSelected--;
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
    }
</style>
