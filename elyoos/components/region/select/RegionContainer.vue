<template>
    <div id="select-region-container">
        <select-region-element :region="region" v-for="region in regions" :key="region.code"
                               :is-top-region="true" :top-region="region.code" :is-international="isInternational"
                               @selected="selected" @unselected="unselected">
        </select-region-element>
    </div>
</template>

<script>
    import SelectRegionElement from './RegionElement';

    export default {
        props: ['regions'],
        components: {SelectRegionElement},
        data() {
            return {selectedRegions: [], isInternational: false}
        },
        methods: {
            selected(region) {
                if (region.code === 'international') {
                    this.selectedRegions = [region];
                    this.isInternational = true;
                } else {
                    this.selectedRegions.push(region);
                    this.selectedRegions = this.selectedRegions.filter((r) => 'international' !== r.code);
                    this.isInternational = false;
                }
                this.$emit('select-changed', this.getCodes(this.selectedRegions));
            },
            unselected(region) {
                if (region.isTopRegion) {
                    this.selectedRegions = this.selectedRegions.filter((r) => region.code !== r.code);
                    this.selectedRegions = this.selectedRegions.filter((r) => region.topRegion !== r.topRegion);
                } else {
                    this.selectedRegions = this.selectedRegions.filter((r) => region.code !== r.code);
                }
                this.$emit('select-changed', this.getCodes(this.selectedRegions));
            },
            getCodes(regions) {
                return regions.map(region => region.code);
            }
        }
    }
</script>

<style lang="scss">
    #select-region-container {
        border-top: 1px solid $divider;
        border-left: 1px solid $divider;
        border-right: 1px solid $divider;
        max-width: 400px;
        margin: 0 auto;
    }
</style>
