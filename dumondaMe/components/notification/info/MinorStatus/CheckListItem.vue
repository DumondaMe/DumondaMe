<template>
    <div class="checklist-item"
         :class="{'challenge-success': challengeStatus[propName]}">
        <v-icon v-if="challengeStatus[propName]">mdi-check</v-icon>
        <v-icon v-else>mdi-circle-small</v-icon>
        {{$t('pages:notifications.challengeStatus.minor.' + propName)}}
    </div>
</template>

<script>
    export default {
        props: ['challengeStatus', 'propName'],
    }
</script>

<style lang="scss">
    .checklist-container {
        padding-top: 14px;

        .checklist-item {
            font-weight: 500;
            color: $secondary-text;
        }

        .checklist-item.challenge-success {
            color: $success-text;

            .v-icon {
                color: $success-text;
            }
        }
    }
</style>