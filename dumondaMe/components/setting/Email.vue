<template>
    <div class="security-setting-container">
        <email-change></email-change>
        <email-notification></email-notification>
    </div>
</template>

<script>
    import EmailNotification from "./EmailNotification";
    import EmailChange from "./EmailChange";

    export default {
        data() {
            return {}
        },
        components: {EmailNotification, EmailChange},
        mixins: [],
        methods: {},
        watch: {}
    }
</script>

<style lang="scss">
    .security-setting-container {
        .security-title {
            font-weight: 500;
            font-size: 18px;
        }

        .new-password-container {
            margin-top: 16px;
            max-width: 300px;
        }

        .change-password-button {
            margin-left: 0;
            margin-top: 18px;
        }

        .password-changed-successfully {
            color: $success-text;
            border-left: 2px solid $success-text;
            padding-left: 12px;
            margin-top: 12px;
        }
    }
</style>
