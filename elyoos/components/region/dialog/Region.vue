<template>
    <v-card id="dialog-create-region-commitment">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-create-region-commitment-content">
            <div class="user-description">{{description}}</div>
            <select-region-container :regions="regions" @select-changed="selectedChanged">
            </select-region-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="finish()" :loading="loading"
                   :disabled="selectedRegions.length === 0  || loading">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import SelectRegionContainer from '~/components/region/select/RegionContainer';

    export default {
        props: ['actionButtonText', 'description', 'loading'],
        components: {SelectRegionContainer},
        data() {
            return {valid: false, regions: [], selectedRegions: [], loadingRegions: false}
        },
        async mounted() {
            this.loadingRegions = true;
            let region = await this.$axios.get('region');
            if (region.data && region.data.regions) {
                this.regions = region.data.regions;
            }
            this.loadingRegions = false;
        },
        methods: {
            selectedChanged(selectedRegions) {
                this.selectedRegions = selectedRegions;
            },
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
