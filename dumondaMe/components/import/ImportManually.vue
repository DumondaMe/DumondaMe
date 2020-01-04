<template>
    <v-card class="import-manually">
        <div id="dumonda-me-dialog-header">
            {{$t("dialog:invite:manually.title")}}
        </div>
        <v-divider></v-divider>
        <v-card-text class="mobile-dialog-content">
            <v-form class="inner-container-manually-import" v-model="valid" ref="form"
                    v-on:submit.prevent="addEmailToContacts">
                <v-text-field type="text" v-model="emailToAdd" name="emailToAdd"
                              :label="$t('common:email')"
                              :rules="[ruleIsEmail($t('validation:isEmail')),
                                       ruleToManyChars($t('validation:toManyChars'), 255),
                                       emailNotExits()]">
                </v-text-field>
                <v-btn color="primary" @click.native="addEmailToContacts" :disabled="!valid" fab small
                       class="add-to-contacts-button">
                    <v-icon>$vuetify.icons.mdiPlus</v-icon>
                </v-btn>
            </v-form>
            <div class="contacts-container">
                <registered-user :contact="existingUser" :last-registered-user="contacts.length === 0"
                                 v-if="existingUser">
                </registered-user>
                <contact :contact="contact" v-for="contact of contacts" :key="contact.email">
                </contact>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click.native="back">
                {{$t("common:button.back")}}
            </v-btn>
            <v-btn color="primary" :loading="loading" :disabled="selectedContacts.length === 0"
                   @click="addContacts">
                {{$t("dialog:invite:manually.addButton")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';
    import Contact from "./Contact";
    import RegisteredUser from "./RegisteredUser";
    import Vue from 'vue';

    export default {
        props: ['initContacts'],
        data() {
            return {
                valid: false, loading: false, formError: false, emailToAdd: '',
                contacts: JSON.parse(JSON.stringify(this.initContacts)),
                existingUser: null
            }
        },
        components: {Contact, RegisteredUser},
        mixins: [validationRules],
        computed: {
            selectedContacts() {
                return this.contacts.filter(contact => contact.isSelected);
            }
        },
        methods: {
            async addEmailToContacts() {
                if (this.valid) {
                    try {
                        this.loading = true;
                        this.existingUser = null;
                        let response = await this.$axios.$put('import/contact/addMetaInfo',
                            {emails: [this.emailToAdd]});
                        if (response.contacts.length === 1 && !response.contacts[0].isPlatformUser) {
                            Vue.set(response.contacts[0], 'isSelected',
                                !response.contacts[0].alreadySentInvitation &&
                                !response.contacts[0].notAllowedToSentInvitation);
                            this.contacts.unshift(response.contacts[0]);
                        } else if (response.contacts.length === 1 && response.contacts[0].isPlatformUser) {
                            debugger
                            this.existingUser = response.contacts[0];
                        }
                        this.emailToAdd = '';
                        Vue.nextTick();
                        this.$refs.form.reset()
                    } catch (error) {

                    } finally {
                        this.loading = false;
                    }
                }
            },
            back() {
                this.$emit('back', this.contacts);
            },
            addContacts() {
                this.$emit('contacts-loaded', this.selectedContacts);
            },
            emailNotExits() {
                return (v) => {
                    if (typeof v === 'string') {
                        let purifiedEmail = v.trim().toLowerCase();
                        if (this.contacts
                            .some(contact => contact.email.trim().toLowerCase() === purifiedEmail)) {
                            return this.$t("dialog:invite:manually.emailExists")
                        }
                    }
                    return true;
                }
            },
        }
    }
</script>

<style lang="scss">
    .import-manually {
        .inner-container-manually-import {
            display: flex;

            .add-to-contacts-button {
                margin-top: 8px;
                margin-left: 12px;
                flex-shrink: 0;
            }
        }

        .contacts-container {
            margin-top: 18px;

            .imported-registered-user {
                margin-bottom: 18px;
            }

            .imported-contact-only-email {
                border-bottom: none;

                .import-checkbox {
                    margin-top: 0;
                }
            }
        }
    }
</style>
