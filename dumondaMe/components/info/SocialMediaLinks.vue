<template>
    <div class="social-media-links-container">
        <div class="social-media-links-inner-container">
            <a class="social-media-button" href="https://www.facebook.com/dumondaMe/" target="_blank" rel="noopener">
                <img :src="facebook"/>
            </a>
            <a class="social-media-button" href="https://linkedin.com/company/dumondame" target="_blank" rel="noopener">
                <img :src="linkedIn"/>
            </a>
            <a class="social-media-button" href="https://www.youtube.com/channel/UCl74yeMn-EzqwcE2Rd-wIzQ"
               target="_blank" rel="noopener">
                <img :src="youtube"/>
            </a>
            <a class="social-media-button" href="https://wa.me/?text=https%3A%2F%2Fwww.dumonda.me" target="_blank" rel="noopener">
                <img :src="whatsApp"/>
            </a>
            <a class="social-media-button last" href="https://telegram.me/share/url?url=https%3A%2F%2Fwww.dumonda.me" target="_blank" rel="noopener">
                <img :src="telegram"/>
            </a>
        </div>
    </div>
</template>

<script>
    export default {

        computed: {
            facebook() {
                return `${process.env.staticUrl}/img/socialMedia/link/facebook_color.png`;
            },
            youtube() {
                return `${process.env.staticUrl}/img/socialMedia/link/youtube.png`;
            },
            linkedIn() {
                return `${process.env.staticUrl}/img/socialMedia/link/linkedIn.png`;
            },
            whatsApp() {
                return `${process.env.staticUrl}/img/socialMedia/link/whatsApp.png`;
            },
            telegram() {
                return `${process.env.staticUrl}/img/socialMedia/link/telegram.png`;
            }
        }
    }
</script>

<style lang="scss">
    .social-media-links-container {
        .social-media-links-inner-container {

            .social-media-button {
                display: inline-block;
                height: 32px;
                width: 32px;
                margin-right: 14px;

                img {
                    height: 100%;
                    border-radius: 2px;
                }
            }
            .social-media-button.last {
                margin-right: 0;
            }
        }
    }
</style>
