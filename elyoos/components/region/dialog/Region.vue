<template>
    <v-card id="dialog-create-region-commitment">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-create-region-commitment-content">
            <div class="user-description">{{description}}</div>
            <select-region-container :regions="regions" select-multiple="true">
            </select-region-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="finish()" :loading="loading"
                   :disabled="selectedRegions.length === 0 || loading || !hasChanged">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {mapGetters} from 'vuex';
    import SelectRegionContainer from '~/components/region/select/RegionContainer';

    export default {
        props: ['actionButtonText', 'description', 'loading', 'initSelectedRegions'],
        components: {SelectRegionContainer},
        data() {
            return {loadingRegions: false}
        },
        computed: {
            hasChanged() {
                if (this.initSelectedRegions && this.selectedRegions) {
                    let initRegions = JSON.parse(JSON.stringify(this.initSelectedRegions));
                    let selectedRegions = JSON.parse(JSON.stringify(this.selectedRegions));
                    return JSON.stringify(initRegions.sort()) !== JSON.stringify(selectedRegions.sort());
                }
                return true;
            },
            ...mapGetters({selectedRegions: 'selectRegions/getSelected', regions: 'selectRegions/getRegions'})
        },
        async mounted() {
            this.loadingRegions = true;
            await this.$store.dispatch('selectRegions/getRegions');
            this.$store.commit('selectRegions/SET_SELECTED_REGIONS', this.initSelectedRegions);
            this.loadingRegions = false;
        },
        methods: {
            finish() {
                this.$emit('finish', this.selectedRegions);
            }
        }
    }
</script>

<style lang="scss">
    #dialog-create-region-commitment {
        max-width: 650px;
        #dialog-create-region-commitment-content {
            max-width: 100%;
            .user-description {
                font-weight: 300;
                max-width: 400px;
                margin: 0 auto 12px auto;
            }
        }
    }
</style>
