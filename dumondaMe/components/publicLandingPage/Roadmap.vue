<template>
    <div class="public-roadmap explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">Roadmap</h2>
            <div class="public-image" @click="$router.push({name: 'nextSteps'})" v-if="showMobile">
                <img v-lazy="roadmap">
            </div>
            <div class="description">
                Es gibt noch sehr viel zu tun! Hauptpriorität haben im Moment der Aufbau einer lebendigen Community, die
                weitere Finanzierung und die Erweiterung der Engagement-Funktionalitäten.
            </div>
            <v-btn color="secondary" class="action-button" @click="$router.push({name: 'nextSteps'})">
                Weitere Schritte
            </v-btn>
        </div>
        <div class="public-image" @click="$router.push({name: 'nextSteps'})" v-if="!showMobile">
            <img v-lazy="roadmap">
        </div>
    </div>
</template>

<script>
    export default {
        props: ['showMobile'],
        computed: {
            roadmap() {
                return `${process.env.staticUrl}/img/landingPagePublic/roadmap.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-roadmap {
        .public-image {
            cursor: pointer;
        }
    }
</style>
