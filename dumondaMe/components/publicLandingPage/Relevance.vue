<template>
    <div class="public-commitments explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">Relevanz</h2>
            <div class="public-image" v-if="showMobile">
                <img :src="filter">
            </div>
            <div class="description">
                Bei vielen Plattformen oder Suchmaschinen wird, basierend auf deiner Nutzung des Dienstes, ein Profil
                von dir angelegt. Dieses Profil verwenden intransparente Algorithmen um zu entscheiden, was dich
                interessieren könnte. Bei DumondaMe hast du die Möglichkeit über Filter- und sonstige Einstellungen
                selber zu bestimmen, welche Informationen für dich relevant sind.
            </div>
        </div>
        <div class="public-image" v-if="!showMobile">
            <img :src="filter">
        </div>
    </div>
</template>

<script>
    export default {
        props: ['showMobile'],
        computed: {
            filter() {
                return `${process.env.staticUrl}/img/landingPagePublic/filter.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-commitments {

    }
</style>
