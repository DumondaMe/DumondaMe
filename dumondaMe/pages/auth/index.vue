<template>

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

</style>