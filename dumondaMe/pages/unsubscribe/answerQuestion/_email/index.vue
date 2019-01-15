<template>
    <div id="unsubscribe-answer-question">
        <unsubscribe-box :unsubscribe-description="$t('pages:unsubscribe.answerQuestion.description',
        {email: $route.params.email})">
        </unsubscribe-box>
    </div>
</template>

<script>
    import UnsubscribeBox from '~/components/unsubscribe/UnsubscribeBox';

    export default {
        async fetch({app, error, params}) {
            try {
                await app.$axios.$post(`unsubscribe/answerQuestion`, {email: params.email});
            } catch (e) {
                error({statusCode: e.statusCode});
            }
        },
        components: {UnsubscribeBox}
    }
</script>

<style lang="scss">
    #unsubscribe-answer-question {
        margin-top: 30px;
    }
</style>