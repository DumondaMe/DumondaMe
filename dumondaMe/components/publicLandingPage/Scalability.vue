<template>
    <div class="public-scalability explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">Wir suchen!</h2>
            <statistic-dumonda-me v-if="showMobile"></statistic-dumonda-me>
            <div class="description">
                Ideen, Kooperationen und Partnerschaften, welche zur finanziellen Stabilität des Projekts beitragen.
                Mehr Informationen zum Projekt findest du in unserem
                <a href="https://drive.google.com/open?id=17cPZT0AoA8SgLvnq0DifZ5-w8FDjrbiy" target="_blank"
                   rel="noopener">Factsheet</a>.
            </div>
        </div>
        <statistic-dumonda-me v-if="!showMobile"></statistic-dumonda-me>
    </div>
</template>

<script>
    import StatisticDumondaMe from './StatisticDumondaMe';

    export default {
        props: ['showMobile'],
        components: {
            StatisticDumondaMe
        }
    }
</script>

<style lang="scss">
    .public-scalability {

    }
</style>
