<template>
    <v-card id="dialog-topic-event">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-create-content-commitment-content">
            <v-form v-model="valid" ref="form">
                <v-text-field v-model="location"
                              :label="$t('pages:commitment.createEventDialog.location')"
                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                </v-text-field>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="finish" :disabled="!valid"
                   :loading="loading">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['actionButtonText', 'loading'],
        data() {
            return {
                valid: false, location: ''
            }
        },
        methods: {
            finish(event) {
                event.preventDefault();
                if (this.$refs.form.validate()) {
                    this.$emit('finish', this.location);
                }
            }
        },
        computed: {},
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #dialog-topic-event {
        max-width: 650px;
    }
</style>
