<template>
    <div class="checklist-item"
         :class="{'challenge-success': challengeStatus[propName]}">
        <v-icon v-if="challengeStatus[propName]">mdi-checkbox-marked-outline</v-icon>
        <v-icon v-else>mdi-checkbox-blank-outline</v-icon>
        <div class="challenge-item-text">{{$t('pages:notifications.challengeStatus.minor.' + propName)}}</div>
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