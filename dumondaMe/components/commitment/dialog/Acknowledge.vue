<template>
    <v-card>
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text class="mobile-dialog-content">
            <div class="acknowledge-description">
                {{$t('pages:commitment.createDialog.acknowledgeDescription')}}
            </div>
            <v-checkbox :label="$t('pages:commitment.createDialog.acknowledgeCheckbox')"
                        v-model="hasAcknowledge" color="primary">
            </v-checkbox>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="$emit('next')" :disabled="!hasAcknowledge">
                {{$t("common:button.next")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        data() {
            return {valid: true, hasAcknowledge: false}
        }
    }
</script>

<style lang="scss" scoped>
    .acknowledge-description {
        margin-bottom: 28px;
    }
</style>
