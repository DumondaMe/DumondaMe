<template>
    <v-card id="dialog-create-key-terms-commitment">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-create-key-terms-commitment-content">
            <v-form v-model="valid">
                <v-btn color="primary" @click="addKeyTerm()" id="add-key-term-button" icon
                       :disabled="!valid || newKeyTerm.trim() === ''">
                    <v-icon>add</v-icon>
                </v-btn>
                <div id="key-term-input">
                    <v-text-field v-model="newKeyTerm"
                                  :label="$t('pages:commitment.createDialog.addKeyTerm')"
                                  :rules="[ruleToManyChars($t('validation:toManyChars'), 30),
                                           keyTermNotAlreadyUsed(),
                                           maxNumberOfKeyTerms()]">
                    </v-text-field>
                </div>
            </v-form>
            <div id="key-term-container">
                <div class="key-term" v-for="keyTerm in keyTerms" :key="keyTerm.name">
                    <v-chip v-model="keyTerm.isActive" @input="onKeyTermRemove(keyTerm)" close>
                        {{keyTerm.name}}
                    </v-chip>
                </div>
                <div id="key-term-description" v-show="keyTerms.length === 0">
                    {{$t("pages:commitment.createDialog.keyTermDescription")}}
                </div>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="$emit('next')" :disabled="newKeyTerm.trim() !== ''">
                {{$t("common:button.next")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    const MAX_NUMBER_OF_KEY_TERMS = 15;

    export default {
        data() {
            return {valid: false, newKeyTerm: '', keyTerms: []}
        },
        methods: {
            addKeyTerm() {
                this.keyTerms.push({name: this.newKeyTerm, isActive: true});
                this.newKeyTerm = '';
            },
            onKeyTermRemove(keyTerm) {
                this.keyTerms = this.keyTerms.filter((v) => v.name !== keyTerm.name);
            },
            keyTermNotAlreadyUsed() {
                if (this.keyTerms.find((v) => v.name === this.newKeyTerm)) {
                    return this.$t("pages:commitment.createDialog.keyTermUsed");
                }
                return true;
            },
            maxNumberOfKeyTerms() {
                return this.keyTerms.length < MAX_NUMBER_OF_KEY_TERMS ||
                    this.$t("pages:commitment.createDialog.maxKeyTerm", {count: MAX_NUMBER_OF_KEY_TERMS});
            }
        },
        mixins: [validationRules]
    }
</script>

<style lang="scss">
    #dialog-create-key-terms-commitment {
        max-width: 650px;
        #dialog-create-key-terms-commitment-content {
            max-width: 100%;
            #key-term-input {
                display: block;
                margin-left: 58px;
            }
            #add-key-term-button {
                float: left;
                margin-top: 19px;
            }
            #key-term-container {
                .key-term {
                    display: inline-block;
                }
                #key-term-description {
                    padding-left: 12px;
                    font-weight: 300;
                }
            }
        }
    }
</style>
