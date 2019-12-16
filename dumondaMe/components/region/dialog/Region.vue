<template>
    <v-card id="dialog-create-region-commitment">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-create-region-commitment-content">
            <div class="user-description">{{description}}</div>
            <ely-select :items="regions" :existing-items="existingRegions" :select-multiple="selectMultiple"
                        :single-selected-item-id="'international'" :dis-select-parent-items="true"
                        :hide-item="hideItem" @select-changed="selectChanged">
            </ely-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="$emit('finish', selectedRegions)" :loading="loading"
                   :disabled="selectedRegions.length === 0 || loading || !hasChanged">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import ElySelect from '~/components/common/select/Select';

    export default {
        props: ['actionButtonText', 'description', 'loading', 'existingRegions', 'notCheckIfChanged', 'selectMultiple',
            'hideItem'],
        components: {ElySelect},
        data() {
            return {regions: [], selectedRegions: [], loadingRegions: false, hasChanged: true}
        },
        async mounted() {
            try {
                this.loadingRegions = true;
                this.regions = await this.$axios.$get(`/region`, {params: {language: this.$store.state.i18n.language}});
                if (this.existingRegions) {
                    this.selectedRegions = JSON.parse(JSON.stringify(this.existingRegions));
                }
                this.hasChanged = this.checkHasChanged();

            } finally {
                this.loadingRegions = false;
            }
        },
        methods: {
            checkHasChanged() {
                if (this.existingRegions && !this.notCheckIfChanged) {
                    return this.existingRegions.length !== this.selectedRegions.length ||
                        !this.existingRegions.every(existingRegion => this.selectedRegions
                            .some(selectedRegion => selectedRegion.id === existingRegion.id));
                }
                return true;
            },
            selectChanged(selectedRegions) {
                this.selectedRegions = selectedRegions;
                this.hasChanged = this.checkHasChanged();
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
                font-size: 16px;
                color: $primary-text;
                max-width: 400px;
                margin: 0 auto 12px auto;
            }
        }
    }
</style>
