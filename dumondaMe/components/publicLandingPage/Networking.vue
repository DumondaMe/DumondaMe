<template>
    <div class="public-networking explanation-element">
        <div class="public-image">
            <img :src="networking">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">Vernetzen</h2>
            <div class="description">
                Auf DumondaMe findest du viele spannende Menschen, welche sich mit gesellschaftsrelevanten Themen
                beschäftigen. Dank sozialen Netzwerkfunktionen kannst du dich unkompliziert mit diesen vernetzen und von
                deren Wissen profitieren.
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            networking() {
                return `${process.env.staticUrl}/img/landingPagePublic/networking.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-networking {

    }
</style>
