<template>
    <v-card id="region-dialog-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text>
            <v-form v-model="valid">
                <v-select :items="topRegions" v-model="parentRegionId" class="select-parent-region-container"
                          item-value="regionId" item-text="description" clearable>
                </v-select>
                <div class="region-container">
                    <h2>{{$t("common:language.de")}}</h2>
                    <v-text-field type="text" v-model="region.de"
                                  :label="$t('pages:regions.dialog.region')"
                                  :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 80)]"
                                  :counter="80">
                    </v-text-field>
                </div>
                <div class="region-container">
                    <h2>{{$t("common:language.en")}}</h2>
                    <v-text-field type="text" v-model="region.en"
                                  :label="$t('pages:regions.dialog.region')"
                                  :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 80)]"
                                  :counter="80">
                    </v-text-field>
                </div>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat :disabled="loading"
                   @click.native="$emit('close-dialog')">{{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="actionStarted" :loading="loading"
                   :disabled="!valid || loading || !changed">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import Vue from 'vue';

    export default {
        props: ['initRegion', 'initParentRegionId', 'actionButtonText', 'loading', 'hasChanged'],
        data: function () {
            return {
                region: JSON.parse(JSON.stringify(this.initRegion)),
                valid: false,
                topRegions: this.$store.getters['regions/getTopRegions'],
                parentRegionId: this.initParentRegionId
            };
        },
        computed: {
            changed() {
                return this.hasChanged(this.region, this.parentRegionId);
            }
        },
        methods: {
            actionStarted() {
                let uploadData = JSON.parse(JSON.stringify(this.region));
                if (this.parentRegionId) {
                    uploadData.parentRegionId = this.parentRegionId;
                } else {
                    uploadData.parentRegionId = 'international';
                }
                this.$emit('finish', uploadData)
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #region-dialog-container {
        .select-parent-region-container {
            margin-bottom: 24px;
        }
        .region-container {
            h2 {
                font-weight: 500;
                margin-bottom: 4px;
            }
            margin-bottom: 24px;
        }
    }
</style>
