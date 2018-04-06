<template>
    <div id="select-region-container">
        <select-region-element :region="region" v-for="region in regions" :key="region.code"
                               :is-top-region="true" :top-region="region.code" :is-international="isInternational">
        </select-region-element>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SelectRegionElement from './RegionElement';

    export default {
        components: {SelectRegionElement},
        data() {
            return {isInternational: false}
        },
        computed: {
            ...mapGetters({
                regions: 'selectRegions/getRegions'
            })
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
