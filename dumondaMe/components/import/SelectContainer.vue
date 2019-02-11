<template>
    <div class="select-imported-contact-container" v-if="contacts && contacts.length > 2">
        <v-checkbox v-model="selectAllState" color="primary" class="select-checkbox" height="20px"
                    @change="changeSelectAllState" :label="$t('dialog:invite:selectAll')">
        </v-checkbox>
        <v-checkbox v-model="showOnlySelectedState" color="primary" class="select-checkbox" height="20px"
                    v-show="numberOfSelectedContacts > 2 && !selectAllState" @change="changeOnlySelectedState"
                    :label="$t('dialog:invite:showOnlySelected')">
        </v-checkbox>
    </div>
</template>

<script>

    export default {
        props: ['contacts', 'numberOfSelectedContacts', 'numberOfAllSelected'],
        data() {
            return {selectAllState: false, showOnlySelectedState: false}
        },
        methods: {
            changeOnlySelectedState(newState) {
                this.$emit('show-only-selected', newState);
            },
            changeSelectAllState(newState) {
                this.$emit('select-all', newState);
                if (newState) {
                    this.showOnlySelectedState = false;
                }
            }
        },
        watch: {
            numberOfSelectedContacts() {
                this.selectAllState = this.numberOfSelectedContacts === this.numberOfAllSelected;
            }
        }
    }
</script>

<style lang="scss">
    .select-imported-contact-container {
        margin-top: 42px;
        border-bottom: 2px solid $primary-color;

        .select-checkbox {
            margin-top: 0;

            .v-input__control {
                .v-input__slot {
                    margin-bottom: 4px;

                    .v-label {
                        color: $primary-text;
                    }
                }
            }
        }
    }
</style>
