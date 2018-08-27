<template>
    <div class="select-region-container">
        <v-menu v-model="menu" :close-on-content-click="false" offset-y max-height="400">
            <div class="select-region" slot="activator">
                <span v-if="localSelectedRegion.id === 'international'">{{localSelectedRegion.description}}</span>
                <span v-else>{{$t("common:region")}}: {{localSelectedRegion.description}}</span>
                <v-icon>mdi-menu-down</v-icon>
            </div>
            <v-card class="ely-menu-region-container">
                <ely-select :items="regions" :select-multiple="false" :min-items='1'
                            :single-selected-item-id="'international'" :existing-items="initRegion"
                            @select-changed="changeRegion">
                </ely-select>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
    import ElySelect from '~/components/common/select/Select';

    export default {
        props: ['initRegion'],
        components: {ElySelect},
        computed: {
            regions() {
                return this.$store.state.region.regions
            }
        },
        data: function () {
            return {
                menu: false, localSelectedRegion: JSON.parse(JSON.stringify(this.initRegion[0]))
            }
        },
        methods: {
            changeRegion(selectedRegion) {
                this.localSelectedRegion = selectedRegion[0];
                this.$emit('region-changed', this.localSelectedRegion)
            }
        },
        watch: {
            async menu(showMenu) {
                if (showMenu) {
                    await this.$store.dispatch('region/getRegions');
                }
            }
        }
    }
</script>

<style lang="scss">
    .select-region-container {
        display: inline-block;
        .select-region {
            display: inline-block;
            vertical-align: top;
            height: 26px;
            line-height: 26px;
            margin-right: 12px;
            color: $secondary-text;
            font-size: 14px;
            cursor: pointer;
            i.v-icon {
                vertical-align: top;
                padding-bottom: 4px;
            }
        }
        :hover.select-region {
            color: $primary-text;
        }
    }
    .ely-menu-region-container {
        .select-container {
            .select-item {
                .item-container {
                    padding: 12px 22px;
                }
            }
        }
    }
</style>
