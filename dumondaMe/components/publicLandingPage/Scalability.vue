<template>
    <div class="public-scalability explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">Skalierbarkeit</h2>
            <statistic-dumonda-me v-if="showMobile"></statistic-dumonda-me>
            <div class="description">
                Wir stehen noch am Anfang, haben aber Grosses vor. Das Ziel ist es, dass diese Plattform Millionen von
                Menschen in der ganzen Welt nutzen können.
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
