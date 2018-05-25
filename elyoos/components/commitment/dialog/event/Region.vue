<template>
    <v-card id="dialog-region-event">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text>
            <div class="description">{{$t('pages:commitment.createEventDialog.regionDescription')}}</div>
            <select-region-container :select-multiple="false" :regions="regions">
            </select-region-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="finish" :disabled="!selectedRegion"
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
        props: ['actionButtonText', 'description', 'loading'],
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
                if (this.selectedRegion) {
                    this.$emit('finish', this.selectedRegion.code);
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
    #dialog-region-event {
        max-width: 650px;
        .description {
            font-weight: 300;
            max-width: 400px;
            margin: 0 auto 12px auto;
        }
    }
</style>
