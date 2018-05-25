<template>
    <div id="select-region-container">
        <select-region-element :region="region" v-for="region in regions" :key="region.code"
                               :is-top-region="true" :top-region="region.code"
                               :select-multiple="selectMultiple">
        </select-region-element>
    </div>
</template>

<script>
    import SelectRegionElement from './RegionElement';

    export default {
        props: ['regions', 'selectMultiple'],
        components: {SelectRegionElement}
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
