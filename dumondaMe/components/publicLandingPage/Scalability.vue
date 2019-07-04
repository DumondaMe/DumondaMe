<template>
    <div class="public-scalability explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">{{$t('pages:landingPagePublic.scalability.title')}}</h2>
            <statistic-dumonda-me v-if="showMobile"></statistic-dumonda-me>
            <div class="description" v-html="$t('pages:landingPagePublic.scalability.description')">
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
