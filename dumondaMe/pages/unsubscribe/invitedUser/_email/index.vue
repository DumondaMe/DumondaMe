<template>
    <div id="unsubscribe-invited-user">
        <unsubscribe-box :unsubscribe-description="$t('pages:unsubscribe.invitedUser.description',
        {email: $route.params.email})">
        </unsubscribe-box>
    </div>
</template>

<script>
    import UnsubscribeBox from '~/components/unsubscribe/UnsubscribeBox';

    export default {
        async fetch({app, error, params}) {
            try {
                await app.$axios.$post(`unsubscribe/invitedUser`, {email: params.email});
            } catch (e) {
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else {
                    error();
                }
            }
        },
        components: {UnsubscribeBox}
    }
</script>

<style lang="scss">
    #unsubscribe-invited-user {
        margin-top: 30px;
    }
</style>