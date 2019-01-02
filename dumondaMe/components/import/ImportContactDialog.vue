<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly"
                  id="import-contact-dialog">
            <v-card id="import-contact-container">
                <v-card-text class="mobile-dialog-content">
                    <import-contact-container @contacts-loaded="contactsLoaded"></import-contact-container>
                    <contact v-for="contact in contacts" :contact="contact" :key="contact.email"
                             @select-changed="selectChanged">
                    </contact>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                        {{$t("common:button.close")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="$emit('close-dialog')" :disabled="selected.length === 0">
                        {{$t("common:button.ok")}}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
    import ImportContactContainer from './ImportContactContainer';
    import Contact from './Contact';

    export default {
        data() {
            return {dialog: true, contacts: [], selected: []}
        },
        components: {Contact, ImportContactContainer},
        methods: {
            contactsLoaded(contacts) {
                this.contacts = this.contacts.concat(contacts);
            },
            selectChanged(eMail) {
                let index = this.selected.indexOf(eMail);
                if (index > -1) {
                    this.selected.splice(index, 1);
                } else {
                    this.selected.push(eMail);
                }
            }
        }
    }
</script>

<style lang="scss">
    #import-contact-dialog {
        #import-contact-container {
            .import-source-container {
                cursor: pointer;
            }
        }
    }
</style>
