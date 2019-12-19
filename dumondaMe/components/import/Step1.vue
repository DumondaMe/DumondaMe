<template>
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
    <import-manually v-else-if="showManually" :init-contacts="tempManuallyContacts"
                     @contacts-loaded="addContactsManually"
                     @back="closeManually">
    </import-manually>
    <sent-message-info v-else-if="showSentMessage" @close-dialog="$emit('close-dialog')"></sent-message-info>
    <v-card id="import-contact-container" v-else>
        <div id="dumonda-me-dialog-header">
            {{$t('dialog:invite:importSourceTitle')}}
        </div>
        <v-divider></v-divider>
        <v-card-text class="mobile-dialog-content">
            <import-contact-container @contacts-loaded="contactsLoaded"
                                      @contacts-only-email-loaded="contactsOnlyEmailLoaded"
                                      @show-basic-auth-gmx="showBasicAuthGmx = true"
                                      @show-basic-auth-webde="showBasicAuthWebDe = true"
                                      @parsing-started="parsingStarted"
                                      @parsing-ended="parsingEnded"
                                      @show-manually="showManually = true">
            </import-contact-container>
            <div class="warning-no-contacts-added" v-show="showNoContactsAddedInfo">
                {{$t("dialog:invite.noContactsAdded")}}
            </div>
            <div class="contacts-container">
                <registered-user v-for="(contact, index) in registeredUsers" :contact="contact"
                                 :key="contact.email"
                                 :last-registered-user="index === registeredUsers.length - 1">
                </registered-user>
                <select-container :contacts="contacts" :number-of-selected-contacts="selectedContacts.length"
                                  :number-of-all-selected="numberOfAllSelected"
                                  @show-only-selected="showOnlySelectedChanged"
                                  @select-all="selectAllChanged">
                </select-container>
                <contact v-for="(contact, index) in contacts" :contact="contact" :key="contact.email"
                         v-show="contact.showContact"
                         :last-registered-user="index === contacts.length - 1">
                </contact>
            </div>
        </v-card-text>
        <div class="show-dialog-error" v-show="selectedContacts.length > 1000">
            {{$t('dialog:invite.maxNumberOfSelected')}}
        </div>
        <v-divider></v-divider>
        <v-card-actions>
            <div class="number-of-selected-contacts" v-show="numberOfAllSelected > 0">
                {{selectedContacts.length}}/{{numberOfAllSelected}}
            </div>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="$emit('next', selectedContacts)"
                   :disabled="selectedContacts.length === 0 || loading || selectedContacts.length > 1000"
                   :loading="loading">
                {{$t("common:button.next")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import ImportContactContainer from './ImportContactContainer';
    import ImportBasicAuth from './ImportBasicAuth';
    import SentMessageInfo from './SentMessageInfo';
    import Contact from './Contact';
    import RegisteredUser from './RegisteredUser';
    import SelectContainer from './SelectContainer';
    import ImportManually from './ImportManually';
    import Vue from 'vue';

    export default {
        data() {
            return {
                contacts: [], registeredUsers: [], showBasicAuthGmx: false, showBasicAuthWebDe: false,
                showSentMessage: false, loading: false, showNoContactsAddedInfo: false, showManually: false,
                tempManuallyContacts: []
            }
        },
        components: {
            Contact, RegisteredUser, ImportContactContainer, ImportBasicAuth, SentMessageInfo, SelectContainer,
            ImportManually
        },
        methods: {
            async contactsOnlyEmailLoaded(contacts) {
                try {
                    contacts = contacts.map(contact => contact.email);
                    contacts = contacts.filter(function (contact, index, self) {
                        return self.indexOf(contact) === index;
                    });
                    let response = await this.$axios.$put('import/contact/addMetaInfo', {emails: contacts});

                    response.contacts = response.contacts.map(function (contact) {
                        contact.source = 'CSV';
                        return contact;
                    });
                    this.contactsLoaded(response.contacts);
                } catch (error) {

                }
            },
            contactsLoaded(contacts) {
                for (let contact of contacts) {
                    Vue.set(contact, 'showContact', true);
                    Vue.set(contact, 'isSelected', false);
                }
                this.showBasicAuthGmx = false;
                this.showBasicAuthWebDe = false;
                this.showNoContactsAddedInfo = this.addContacts(contacts);
            },
            async addContactsManually(contacts) {
                for (let contact of contacts) {
                    Vue.set(contact, 'showContact', true);
                }
                this.showNoContactsAddedInfo = this.addContacts(contacts);
                this.showManually = false;
                this.tempManuallyContacts = [];
            },
            closeManually(contacts) {
                this.showManually = false;
                this.tempManuallyContacts = contacts;
            },
            checkContactNotExisting(newContact) {
                return !this.contacts.concat(this.registeredUsers).find(function (contact) {
                    return contact.email === newContact.email;
                });
            },
            addContacts(newContacts) {
                let noContactAdded = true;
                for (let newContact of newContacts) {
                    if (this.checkContactNotExisting(newContact)) {
                        if (newContact.userId) {
                            this.registeredUsers.push(newContact);
                        } else {
                            this.contacts.push(newContact);
                        }
                        noContactAdded = false;
                    }
                }
                return noContactAdded;
            },
            showAllContacts() {
                for (let contact of this.contacts) {
                    contact.showContact = true;
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
                    if (!contact.alreadySentInvitation && !contact.notAllowedToSentInvitation) {
                        contact.isSelected = selectAll;
                    }
                }
            },
            async parsingStarted() {
                this.loading = true;
            },
            async parsingEnded() {
                this.loading = false;
            },
            async next() {
                this.$emit('next', this.selectedContacts);
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
                    if (!contact.alreadySentInvitation && !contact.notAllowedToSentInvitation) {
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

        .warning-no-contacts-added {
            font-size: 16px;
            color: $warning;
        }
    }
</style>
