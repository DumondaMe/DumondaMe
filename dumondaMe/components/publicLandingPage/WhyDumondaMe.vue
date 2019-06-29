<template>
    <div class="public-why-dumonda-me explanation-element">
        <div class="public-image">
            <img :src="explainVideo">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">Wieso braucht es DumondaMe?</h2>
            <div class="description">
                Wenn wir das volle Potenzial der kollektiven Intelligenz zur nachhaltigen Lösung der Probleme unserer
                Zeit nutzen wollen, dann brauchen wir DumondaMe!
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            explainVideo() {
                return `${process.env.staticUrl}/img/landingPagePublic/whyDumondaMe.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-why-dumonda-me {

    }
</style>
