<template>
    <div class="imported-contact">
        <div v-if="!contact.userId">
            <v-checkbox v-model="importContact" color="secondary" class="import-checkbox"
                        :label="getUserLabel">
            </v-checkbox>
        </div>
        <div v-else class="existing-user">
            <div class="user-image">
                <img :src="contact.userImage"/>
            </div>
            <div class="user-content-container">
                <div class="user-name">{{contact.name}}</div>
                <div class="user-email-address">{{contact.email}}</div>
            </div>
            <v-spacer></v-spacer>
            <div class="add-to-trust-circle-container">
                <v-tooltip bottom v-if="!contact.isTrustUser && !loading">
                    <v-btn icon slot="activator" @click="addUserToTrustCircle()">
                        <v-icon>mdi-account-plus-outline</v-icon>
                    </v-btn>
                    <span>{{$t('pages:feeds.userSuggestion.addUser', {name: contact.name})}}</span>
                </v-tooltip>
                <div class="adding-user-to-trust-circle-loading text-xs-center" v-else-if="loading">
                    <v-progress-circular indeterminate color="primary" size="22"></v-progress-circular>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['contact'],
        data() {
            return {importContact: false, loading: false}
        },
        components: {},
        methods: {
            addUserToTrustCircle() {

            }
        },
        computed: {
            getUserLabel() {
                if (this.contact.source) {
                    return `${this.contact.email} (${this.contact.source})`
                }
                return this.contact.email;
            }
        },
        watch: {
            importContact() {
                this.$emit('select-changed', this.contact.email);
            }
        }
    }
</script>

<style lang="scss">
    .imported-contact {
        border-bottom: 1px solid $divider;

        .import-checkbox {

        }

        .existing-user {
            padding: 14px 0;
            display: flex;

            .user-image {
                height: 40px;
                width: 40px;

                img {
                    height: 100%;
                    width: 100%;
                    border-radius: 4px;
                }
            }

            .user-content-container {
                margin-left: 12px;

                .user-name {
                    font-weight: 500;
                    line-height: 16px;
                    font-size: 16px;
                }

                .user-email-address {
                    margin-top: 6px;
                    font-size: 14px;
                    color: $secondary-text;
                }
            }

            .add-to-trust-circle-container {
            }
        }
    }
</style>
