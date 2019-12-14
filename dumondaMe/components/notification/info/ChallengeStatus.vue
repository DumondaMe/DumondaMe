<template>
    <div class="challenge-status-container ely-card">
        <div class="challenge-title">
            {{$t('pages:notifications.challengeStatus.title')}}
        </div>
        <div class="challenge-description">
            <span v-if="allSuccess">{{$t('pages:notifications.challengeStatus.successDescription')}}</span>
            <span v-else>{{$t('pages:notifications.challengeStatus.description')}}</span>
        </div>
        <status :challenge-status="challengeStatus">
        </status>
    </div>
</template>

<script>
    import Status from './Status/Status';

    export default {
        props: ['challengeStatus'],
        components: {Status},
        computed: {
            allSuccess() {
                for (let status in this.challengeStatus) {
                    if (this.challengeStatus.hasOwnProperty(status) && this.challengeStatus[status] === false) {
                        return false;
                    }
                }
                return true;
            }
        }
    }
</script>

<style lang="scss">
    .challenge-status-container {
        margin-bottom: 8px;

        .challenge-title {
            @include defaultPaddingCard();
            font-weight: 500;
            font-size: 16px;
            margin-bottom: 8px;
        }

        .challenge-description {
            @include defaultPaddingCard();
            font-weight: 300;
            font-size: 16px;
            margin-bottom: 12px;
        }
    }
</style>