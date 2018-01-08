<template>
    <div id="first-row">
        <login></login>
        <register-link></register-link>
    </div>
</template>

<script>
    import Login from '~/components/login/Login.vue';
    import RegisterLink from '~/components/login/RegisterLink.vue';

    export default {
        components: {Login, RegisterLink}
    }
</script>

<style lang="scss">

</style>