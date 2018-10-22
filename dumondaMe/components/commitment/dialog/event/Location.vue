<template>
    <v-card id="dialog-location-event">
        <div>
            <slot name="header"></slot>
        </div>
        <div id="location-description">
            {{location}} <span v-if="selectedRegion">({{selectedRegion.description}})</span>
        </div>
        <v-card-text class="mobile-dialog-content">
            <v-form v-model="valid" ref="form" class="input-location">
                <v-text-field v-model="location"
                              :label="$t('pages:commitment.createEventDialog.location')"
                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                </v-text-field>
            </v-form>
            <div class="description-region">{{$t('pages:commitment.createEventDialog.regionDescription')}}</div>
            <ely-select :items="regions" :existing-items="initRegion" :select-multiple="false"
                        @select-changed="selectChanged">
            </ely-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="finish" :disabled="!valid || !selectedRegion || !hasChanged"
                   :loading="loading">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import ElySelect from '~/components/common/select/Select';

    export default {
        props: ['actionButtonText', 'loading', 'initLocation', 'initRegion'],
        components: {ElySelect},
        data() {
            let region = this.initRegion || null;
            if (region && region.length === 1) {
                region = region[0];
            }
            return {
                valid: false, location: this.initLocation, loadingRegions: false,
                regions: [], hasChanged: false, selectedRegion: JSON.parse(JSON.stringify(region))
            }
        },
        async mounted() {
            this.loadingRegions = true;
            this.regions = await this.$axios.$get(`/region`, {params: {language: this.$store.state.i18n.language}});
            let indexInternational = this.regions.findIndex((region) => region.id === 'international');
            if (indexInternational !== -1) {
                this.regions.splice(indexInternational, 1);
            }
            this.loadingRegions = false;
        },
        methods: {
            finish(event) {
                event.preventDefault();
                if (this.$refs.form.validate() && this.selectedRegion) {
                    this.$emit('finish', {location: this.location, region: this.selectedRegion});
                }
            },
            checkHasChanged() {
                if (this.initRegion) {
                    return this.selectedRegion && this.initRegion[0].id !== this.selectedRegion.id ||
                        this.location !== this.initLocation;
                }
                return true;
            },
            selectChanged(selectedRegion) {
                if (selectedRegion && selectedRegion.length === 1) {
                    this.selectedRegion = selectedRegion[0];
                } else {
                    this.selectedRegion = null;
                }
                this.hasChanged = this.checkHasChanged();
            }
        },
        watch: {
            location() {
                this.hasChanged = this.checkHasChanged();
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #dialog-location-event {
        max-width: 650px;
        #location-description {
            text-align: center;
            max-width: 400px;
            font-weight: 500;
            width: 100%;
            padding-bottom: 6px;
            margin: 8px auto 0 auto;
            color: $primary-color;
        }
        .input-location {
            max-width: 400px;
            margin: 0 auto;
        }
        .description-region {
            font-weight: 300;
            max-width: 400px;
            margin: 0 auto 12px auto;
        }
    }
</style>
