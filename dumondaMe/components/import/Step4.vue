<template>
    <v-card class="send-invitations-container">
        <div id="dumonda-me-dialog-header">
            {{$t('dialog:invite:sendInvitation.title')}}
        </div>
        <v-divider></v-divider>
        <v-card-text class="mobile-dialog-content">
            <div v-if="!showSentMessage">
                <div class="text-description">
                    {{$t('dialog:invite:sendInvitation.isOkayToSend', {count: contacts.length})}}
                </div>
                <div v-for="contact of contacts" class="contact-email">
                    {{contact}}
                </div>
            </div>
            <div v-else>
                {{$t("dialog:invite:sendInvitation.sentMessage")}}
            </div>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" text @click.native="$emit('back')" v-if="!showSentMessage">
                {{$t("common:button.back")}}
            </v-btn>
            <v-btn color="primary" @click="sendInvitations" :disabled="loading || showSentMessage"
                   v-show="!showSentMessage" :loading="loading">
                {{$t("dialog:invite:sendInvitation.sendButton")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import ProfileImage from '~/components/info/welcomeDialog/ProfileImage'
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['contacts', 'text', 'language'],
        data() {
            return {showSentMessage: false, loading: false}
        },
        components: {ProfileImage},
        mixins: [validationRules],
        methods: {
            async sendInvitations() {
                try {
                    this.loading = true;
                    await this.$axios.$put('user/otherUser/invite',
                        {emails: this.contacts, text: this.text, language: this.language});
                    this.showSentMessage = true;
                } catch (error) {

                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    .send-invitations-container {

        .text-description {
            margin-bottom: 18px;
            color: $primary-text;
            font-size: 16px;
            font-weight: 300;
        }

        .contact-email {
            color: $secondary-text;
            font-size: 16px;
            margin-bottom: 4px;
        }
    }
</style>
