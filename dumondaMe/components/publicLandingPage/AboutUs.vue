<template>
    <div class="public-about-us explanation-element">
        <div class="public-image" @click="$router.push({name: 'aboutUs'})">
            <img :src="team">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">Wer steht hinter DumondaMe?</h2>
            <div class="description">
                Wir sind eine Gruppe von Menschen die mit viel Herzblut diese Plattform aufbauen. Dazu gehört eine
                immer grösser werdende Community, die uns auf ehrenamtlicher Basis unterstützt und so einen grossen
                Beitrag zum Gelingen dieses Projekts beiträgt.
            </div>
            <v-btn color="secondary" class="action-button" @click="$router.push({name: 'aboutUs'})">
                Über Uns
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            team() {
                return `${process.env.staticUrl}/img/landingPagePublic/team.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-about-us {
        .public-image {
            cursor: pointer;
        }
    }
</style>
