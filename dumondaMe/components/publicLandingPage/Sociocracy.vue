<template>
    <div class="public-sociocracy explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">Soziokratie</h2>
            <div class="description">
                Uns ist es wichtig, dass die Gleichwertigkeit aller Menschen bereits in unserer Organisation verankert
                ist. Aus diesem und vielen anderen Gründen haben wir uns für die Organisationsform Soziokratie
                entschieden.
            </div>
        </div>
        <div class="public-image">
            <img :src="filter">
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            filter() {
                return `${process.env.staticUrl}/img/landingPagePublic/sociocracy.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-sociocracy {

    }
</style>
