<template>
    <v-card id="dialog-topic-event">
        <div>
            <slot name="header"></slot>
        </div>
        <div id="location-description">
            {{location}} <span v-if="selectedRegion">({{$t("regions:" + selectedRegion.code)}})</span>
        </div>
        <v-card-text id="dialog-create-content-commitment-content">
            <v-form v-model="valid" ref="form" class="input-location">
                <v-text-field v-model="location"
                              :label="$t('pages:commitment.createEventDialog.location')"
                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                </v-text-field>
            </v-form>
            <div class="description-region">{{$t('pages:commitment.createEventDialog.regionDescription')}}</div>
            <select-region-container :select-multiple="false" :regions="regions">
            </select-region-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="finish" :disabled="!valid || !selectedRegion"
                   :loading="loading">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import {mapGetters} from 'vuex';
    import validationRules from '~/mixins/validationRules.js';
    import SelectRegionContainer from '~/components/region/select/RegionContainer';

    export default {
        props: ['actionButtonText', 'loading'],
        components: {SelectRegionContainer},
        data() {
            return {
                valid: false, location: '', loadingRegions: false
            }
        },
        async mounted() {
            this.loadingRegions = true;
            await this.$store.dispatch('selectRegion/getRegions');
            this.loadingRegions = false;
        },
        methods: {
            finish(event) {
                event.preventDefault();
                if (this.$refs.form.validate() && this.selectedRegion) {
                    this.$emit('finish', {location: this.location, region: this.selectedRegion.code});
                }
            }
        },
        computed: {
            ...mapGetters({regions: 'selectRegion/getRegions', selectedRegion: 'selectRegion/getSelectedRegion'})
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #dialog-topic-event {
        max-width: 650px;
        #location-description {
            text-align: center;
            max-width: 400px;
            font-weight: 500;
            width: 100%;
            padding-bottom: 6px;
            margin: 0 auto;
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
