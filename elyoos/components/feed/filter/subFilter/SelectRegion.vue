<template>
    <div class="select-region-container">
        <v-menu v-model="menu" :close-on-content-click="false" offset-y max-height="400">
            <div class="select-region" slot="activator">
                <span v-if="localSelectedRegion.id === 'international'">{{localSelectedRegion.description}}</span>
                <span v-else>{{$t("common:region")}}: {{localSelectedRegion.description}}</span>
            </div>
            <v-card class="ely-menu-container">
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
            },
            selectedRegion() {
                return this.$store.state.region.regions
            }
        },
        data: function () {
            return {
                showError: false, loadingRegions: false, menu: false,
                localSelectedRegion: JSON.parse(JSON.stringify(this.initRegion[0]))
            }
        },
        methods: {
            changeRegion(selectedRegion) {
                this.localSelectedRegion = selectedRegion[0];

            }
        },
        watch: {
            async menu(showMenu) {
                if (showMenu) {
                    await this.$store.dispatch('region/getRegions');
                } else {
                    this.$emit('region-changed', this.localSelectedRegion)
                }
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

    .ely-menu-container {
        .select-container {
            .select-item {
                .item-container {
                    padding: 12px 22px;
                }
            }
        }
    }
</style>
