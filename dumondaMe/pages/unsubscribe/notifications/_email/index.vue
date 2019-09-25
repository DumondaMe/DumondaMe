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
                await app.$axios.$post(`unsubscribe/notifications`, {email: params.email});
            } catch (e) {
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else {
                    error({statusCode: 600});
                }
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