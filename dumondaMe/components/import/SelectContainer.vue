<template>
    <div class="select-imported-contact-container" v-if="contacts && contacts.length > 2">
        <v-checkbox v-model="selectAllState" color="primary" class="select-checkbox" height="20px"
                    @change="changeSelectAllState" :label="$t('dialog:invite:selectAll')">
        </v-checkbox>
        <v-checkbox v-model="showOnlySelectedState" color="primary" class="select-checkbox" height="20px"
                    v-show="numberOfSelectedContacts > 2 && !selectAllState" @change="changeOnlySelectedState"
                    :label="$t('dialog:invite:showOnlySelected')">
        </v-checkbox>
        <v-checkbox v-model="showOnlyRegisteredUsersState" color="primary" class="select-checkbox" height="20px"
                    v-show="containsRegisteredUsers" @change="changeOnlyRegisteredUserState"
                    :label="$t('dialog:invite:showOnlyRegisteredUsers')">
        </v-checkbox>
    </div>
</template>

<script>

    export default {
        props: ['contacts', 'numberOfSelectedContacts', 'numberOfAllSelected'],
        data() {
            return {selectAllState: false, showOnlySelectedState: false, showOnlyRegisteredUsersState: false}
        },
        methods: {
            changeOnlyRegisteredUserState(newState) {
                this.$emit('show-only-registered-user', newState);
                if (newState) {
                    this.showOnlySelectedState = false;
                }
            },
            changeOnlySelectedState(newState) {
                this.$emit('show-only-selected', newState);
                if (newState) {
                    this.showOnlyRegisteredUsersState = false;
                }
            },
            changeSelectAllState(newState) {
                this.$emit('select-all', newState);
                if (newState) {
                    this.showOnlySelectedState = false;
                    this.showOnlyRegisteredUsersState = false;
                }
            }
        },
        computed: {
            containsRegisteredUsers() {
                for (let contact of this.contacts) {
                    if (contact.hasOwnProperty('userId')) {
                        return true;
                    }
                }
                return false;
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
        border-bottom: 2px solid $divider;

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
