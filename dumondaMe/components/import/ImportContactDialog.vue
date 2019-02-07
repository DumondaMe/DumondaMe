<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <import-basic-auth v-if="showBasicAuthGmx" :label-email="$t('dialog:invite:gmx.email')"
                               :dialog-title="$t('dialog:invite:gmx.title')" import-url="import/contact/gmx"
                               source-description="GMX"
                               @contacts-loaded="contactsLoaded"
                               @close="showBasicAuthGmx = false">
            </import-basic-auth>
            <import-basic-auth v-else-if="showBasicAuthWebDe" :label-email="$t('dialog:invite:webDe.email')"
                               :dialog-title="$t('dialog:invite:webDe.title')" import-url="import/contact/webDe"
                               source-description="WebDe"
                               @contacts-loaded="contactsLoaded"
                               @close="showBasicAuthWebDe = false">
            </import-basic-auth>
            <sent-message-info v-else-if="showSentMessage" @close-dialog="$emit('close-dialog')"></sent-message-info>
            <v-card id="import-contact-container" v-else>
                <div id="dumonda-me-dialog-header">
                    {{$t('dialog:invite:importSourceTitle')}}
                </div>
                <v-divider></v-divider>
                <v-card-text class="mobile-dialog-content">
                    <import-contact-container @contacts-loaded="contactsLoaded"
                                              @show-basic-auth-gmx="showBasicAuthGmx = true"
                                              @show-basic-auth-webde="showBasicAuthWebDe = true">
                    </import-contact-container>
                    <div class="contacts-container">
                        <select-container :contacts="contacts" :number-of-selected-contacts="selectedContacts.length"
                                          :number-of-all-selected="numberOfAllSelected"
                                          @show-only-registered-user="showOnlyRegisteredUsersChanged"
                                          @show-only-selected="showOnlySelectedChanged"
                                          @select-all="selectAllChanged">
                        </select-container>
                        <contact v-for="contact in contacts" :contact="contact" :key="contact.email"
                                 @select-changed="selectChanged" v-show="contact.showContact">
                        </contact>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <div class="number-of-selected-contacts" v-show="selectedContacts.length > 0">
                        {{selectedContacts.length}}
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                        {{$t("common:button.close")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="sendInvitations"
                           :disabled="selectedContacts.length === 0 || loading" :loading="loading">
                        {{$t("dialog:invite.sendButton")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import ImportContactContainer from './ImportContactContainer';
    import ImportBasicAuth from './ImportBasicAuth';
    import SentMessageInfo from './SentMessageInfo';
    import Contact from './Contact';
    import SelectContainer from './SelectContainer';
    import Vue from 'vue';

    export default {
        data() {
            return {
                dialog: true, contacts: [], showBasicAuthGmx: false, showBasicAuthWebDe: false, showSentMessage: false,
                loading: false
            }
        },
        components: {Contact, ImportContactContainer, ImportBasicAuth, SentMessageInfo, SelectContainer},
        methods: {
            contactsLoaded(contacts) {
                for (let contact of contacts) {
                    Vue.set(contact, 'showContact', true);
                    Vue.set(contact, 'isSelected', false);
                }
                this.addContacts(contacts);
                this.showBasicAuthGmx = false;
                this.showBasicAuthWebDe = false;
            },
            checkContactNotExisting(newContact) {
                return !this.contacts.find(function (contact) {
                    if (newContact.email) {
                        return contact.email === newContact.email;
                    } else {
                        return contact.userId === newContact.userId;
                    }
                });
            },
            addContacts(newContacts) {
                for (let newContact of newContacts) {
                    if (this.checkContactNotExisting(newContact)) {
                        this.contacts.push(newContact);
                    }
                }
            },
            selectChanged(eMail) {
                let changedContact = this.contacts.find(function (contact) {
                    return contact.email === eMail;
                });
                changedContact.isSelected = !changedContact.isSelected;
            },
            showRegisteredUsers() {
                for (let contact of this.contacts) {
                    contact.showContact = false;
                    if (contact.userId) {
                        contact.showContact = true;
                    }
                }
            },
            showAllContacts() {
                for (let contact of this.contacts) {
                    contact.showContact = true;
                }
            },
            showOnlyRegisteredUsersChanged(onlyRegisteredUsers) {
                if (onlyRegisteredUsers) {
                    this.showRegisteredUsers();
                } else {
                    this.showAllContacts();
                }
            },
            showOnlySelected() {
                for (let contact of this.contacts) {
                    contact.showContact = contact.isSelected;
                }
            },
            showOnlySelectedChanged(onySelected) {
                if (onySelected) {
                    this.showOnlySelected();
                } else {
                    this.showAllContacts();
                }
            },
            selectAllChanged(selectAll) {
                for (let contact of this.contacts) {
                    if (contact.email) {
                        contact.isSelected = selectAll;
                    }
                }
            },
            async sendInvitations() {
                try {
                    this.loading = true;
                    await this.$axios.$put('user/otherUser/invite', {emails: this.selectedContacts});
                    this.showSentMessage = true;
                } catch (error) {

                } finally {
                    this.loading = false;
                }
            }
        },
        computed: {
            selectedContacts() {
                let selected = [];
                for (let contact of this.contacts) {
                    if (contact.isSelected && contact.email) {
                        selected.push(contact.email);
                    }
                }
                return selected;
            },
            numberOfAllSelected() {
                let total = 0;
                for (let contact of this.contacts) {
                    if (contact.email) {
                        total++;
                    }
                }
                return total;
            }
        }
    }
</script>

<style lang="scss">
    #import-contact-container {
        .import-source-container {
            cursor: pointer;
        }

        .contacts-container {
            margin-top: 38px;
        }

        .number-of-selected-contacts {
            padding-left: 12px;
            font-weight: 500;
            color: $secondary-text;
        }
    }
</style>
