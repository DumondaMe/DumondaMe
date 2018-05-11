<template>
    <div id="g-recaptcha" class="g-recaptcha" :data-sitekey="sitekey"></div>
</template>

<script>
    export default {
        data() {
            return {
                sitekey: '6LfWvyYTAAAAADB8n5MjlwL2V23ZRKCJY3wUbixJ',
                widgetId: 25687563874
            }
        },
        created() {
            if (process.browser) {
                window.onloadRecaptchaCallback = this.render;
            }
        },
        methods: {
            execute() {
                window.grecaptcha.execute(this.widgetId);
            },
            reset() {
                window.grecaptcha.reset(this.widgetId);
                self.$emit('response', null);
            },
            render() {
                let self = this;
                self.widgetId = window.grecaptcha.render('g-recaptcha', {
                    sitekey: self.sitekey,
                    theme: "light",
                    hl: self.$store.state.i18n.language,
                    'expired-callback': self.reset,
                    callback: (response) => {
                        self.$emit('response', response);
                    }
                })
            }
        }
    }
</script>

<style lang="scss">

</style>
