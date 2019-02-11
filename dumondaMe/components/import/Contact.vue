<template>
    <div class="imported-contact-only-email" :class="{'last-registered-user': lastRegisteredUser}">
        <v-checkbox v-model="contact.isSelected" color="primary" class="import-checkbox"
                    :disabled="contact.alreadySentInvitation || contact.notAllowedToSentInvitation">
            <div slot="label">
                <div>{{getUserLabel}}</div>
                <div v-if="contact.alreadySentInvitation" class="checkbox-info">
                    {{$t('dialog:invite.alreadySent')}}
                </div>
                <div v-else-if="contact.notAllowedToSentInvitation" class="checkbox-info">
                    {{$t('dialog:invite.notAllowedToSent')}}
                </div>
            </div>
        </v-checkbox>
    </div>
</template>

<script>

    export default {
        props: ['contact', 'lastRegisteredUser'],
        computed: {
            getUserLabel() {
                if (this.contact.source) {
                    return `${this.contact.email} (${this.contact.source})`
                }
                return this.contact.email;
            },
        }
    }
</script>

<style lang="scss">
    .imported-contact-only-email {
        border-bottom: 1px solid $divider;

        .import-checkbox {
            display: inline-block;

            .checkbox-info {
                font-size: 14px;
                color: $warning;
            }
        }
    }

    .imported-contact-only-email.last-registered-user {
        border-bottom: none;
    }
</style>
