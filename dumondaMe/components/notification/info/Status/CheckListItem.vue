<template>
    <div class="checklist-item"
         :class="{'challenge-success': challengeStatus[propName]}">
        <v-icon v-if="challengeStatus[propName]">{{$icons.mdiCheckboxMarkedOutline}}</v-icon>
        <v-icon v-else>{{$icons.mdiCheckboxBlankOutline}}</v-icon>
        <div class="challenge-item-text">{{$t('pages:notifications.challengeStatus.minor.' + propName)}}</div>
    </div>
</template>

<script>
    import {mdiCheckboxMarkedOutline, mdiCheckboxBlankOutline} from "@mdi/js";

    export default {
        props: ['challengeStatus', 'propName'],
        created() {
            this.$icons = {mdiCheckboxMarkedOutline, mdiCheckboxBlankOutline}
        }
    }
</script>

<style lang="scss">
    .checklist-container {
        padding-top: 14px;

        .checklist-item {
            display: flex;
            margin-bottom: 4px;
            font-weight: 500;
            color: $secondary-text;

            .challenge-item-text {
                padding-left: 4px;
                line-height: 26px;
                text-align: center;
            }
        }

        .checklist-item.challenge-success {
            color: $success-text;

            .v-icon {
                color: $success-text;
            }
        }
    }
</style>