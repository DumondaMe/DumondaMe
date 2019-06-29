<template>
    <div class="public-question-answer explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">Fragen stellen</h2>
            <div class="description">
                Die richtigen Fragen können die Welt verändern! Deshalb ist die Frage/Antwort-Funktionalität das
                Herzstück der Plattform. Dank dieser werden deine Fragen von der DumondaMe-Community mit Videos, Links,
                Bücher, Engagements und Texten beantwortet.
            </div>
            <v-btn color="secondary" class="action-button" @click="$router.push({name: 'question'})">
                Zu den Fragen
            </v-btn>
        </div>
        <div class="public-image" @click="$router.push({name: 'question'})">
            <img :src="concept">
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            concept() {
                return `${process.env.staticUrl}/img/landingPagePublic/concept_2x.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-question-answer {
        .public-image {
            img {
                cursor: pointer;
                max-width: 570px;
            }
        }
    }
</style>
