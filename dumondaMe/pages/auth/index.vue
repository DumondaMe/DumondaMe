<template>
    <div>
        <div id="auth-loading-message">{{$t('pages:auth.loadingMessage')}}</div>
        <div class=" text-xs-center">
            <v-progress-circular indeterminate color="primary" size="52"></v-progress-circular>
        </div>
    </div>
</template>

<script>
    export default {
        async mounted() {
            if (window.opener !== null && typeof window.opener.dumondaMeChildWindowUrl === 'function') {
                await window.opener.dumondaMeChildWindowUrl(window.location.href);
            }
            window.close();
        }
    }
</script>

<style lang="scss">
    #auth-loading-message {
        margin-top: 52px;
        margin-bottom: 12px;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
    }
</style>