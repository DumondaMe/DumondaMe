<template>
    <v-card class="invited-user-sent-message">
        <div id="dumonda-me-dialog-header">
            {{$t('dialog:invite.invitationSentTitle')}}
        </div>
        <v-divider></v-divider>
        <v-card-text class="mobile-dialog-content">
            <img :src="invitationImage" :srcset="invitation2xImage" class="invitation-sent-image">
            <div class="invited-user-message">
                {{$t('dialog:invite.invitationSentMessage')}}
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        computed: {
            invitationImage() {
                return `${process.env.staticUrl}/img/import/invitationSent.jpg`;
            },
            invitation2xImage() {
                return `${process.env.staticUrl}/img/import/invitationSent_2x.jpg 2x`;
            }
        }
    }
</script>

<style lang="scss">
    .invited-user-sent-message {
        .invitation-sent-image {
            display: block;
            width: 100%;
            max-width: 300px;
            margin: 0 auto 24px auto;
            border-radius: 4px;
        }
        .invited-user-message {
            font-weight: 300;
        }
    }
</style>
