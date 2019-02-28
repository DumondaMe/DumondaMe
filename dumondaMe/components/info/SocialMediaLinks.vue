<template>
    <div class="social-media-links-container">
        <div class="social-media-links-inner-container">
            <a class="social-media-button" href="https://www.facebook.com/dumondaMe/" target="_blank" rel="noopener">
                <img v-lazy="facebook"/>
            </a>
            <a class="social-media-button" href="https://linkedin.com/company/dumondame" target="_blank" rel="noopener">
                <img v-lazy="linkedIn"/>
            </a>
            <a class="social-media-button" href="https://www.youtube.com/channel/UCl74yeMn-EzqwcE2Rd-wIzQ"
               target="_blank" rel="noopener">
                <img v-lazy="youtube"/>
            </a>
            <a class="social-media-button" href="https://wa.me/?text=https%3A%2F%2Fyoutu.be%2FhcCvaH0RJj4%20ist%20das%20Erkl%C3%A4rvideo%20f%C3%BCr%20das%20neue%20soziale%20Netzwerk%20DumondaMe%20%28https%3A%2F%2Fwww.dumonda.me%29.%20Unterst%C3%BCtze%20uns%20und%20teile%20diese%20Nachricht%20auf%20Whatsapp%2C%20damit%20m%C3%B6glichst%20viele%20Menschen%20von%20diesem%20Projekt%20erfahren.%20Gemeinsam%20ist%20alles%20m%C3%B6glich%21%20Legen%20wir%20heute%20einen%20weiteren%20Grundstein%20f%C3%BCr%20eine%20Zukunft%2C%20in%20der%20ein%20nachhaltiger%20Umgang%20mit%20der%20Natur%2C%20soziale%20Gerechtigkeit%2C%20eine%20hohe%20Lebensqualit%C3%A4t%20und%20Frieden%20so%20selbstverst%C3%A4ndlich%20ist%20wie%20die%20Luft%20zum%20Atmen..." target="_blank" rel="noopener">
                <img v-lazy="whatsApp"/>
            </a>
            <a class="social-media-button last" href="https://telegram.me/share/url?url=https%3A%2F%2Fyoutu.be%2FhcCvaH0RJj4%20ist%20das%20Erkl%C3%A4rvideo%20f%C3%BCr%20das%20neue%20soziale%20Netzwerk%20DumondaMe%20%28https%3A%2F%2Fwww.dumonda.me%29.%20Unterst%C3%BCtze%20uns%20und%20teile%20diese%20Nachricht%20auf%20Telegram%2C%20damit%20m%C3%B6glichst%20viele%20Menschen%20von%20diesem%20Projekt%20erfahren.%20Gemeinsam%20ist%20alles%20m%C3%B6glich%21%20Legen%20wir%20heute%20einen%20weiteren%20Grundstein%20f%C3%BCr%20eine%20Zukunft%2C%20in%20der%20ein%20nachhaltiger%20Umgang%20mit%20der%20Natur%2C%20soziale%20Gerechtigkeit%2C%20eine%20hohe%20Lebensqualit%C3%A4t%20und%20Frieden%20so%20selbstverst%C3%A4ndlich%20ist%20wie%20die%20Luft%20zum%20Atmen..." target="_blank" rel="noopener">
                <img v-lazy="telegram"/>
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
