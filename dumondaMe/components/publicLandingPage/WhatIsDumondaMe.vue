<template>
    <div class="public-why-dumonda-me explanation-element">
        <div class="public-image" @click="openExplainVideo" v-if="!showMobile">
            <img :src="explainVideo">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">Was ist DumondaMe?</h2>
            <div class="public-image" @click="openExplainVideo" v-if="showMobile">
                <img :src="explainVideo">
            </div>
            <div class="description">
                DumondaMe ist ein soziales Netzwerk mit dem Fokus auf gesellschaftsrelevante Themen. Dabei steht
                folgende Fragestellung im Mittelpunkt: Wie verändern wir die Welt zu einem Ort, wo ein nachhaltiger
                Umgang mit der Natur, soziale Gerechtigkeit, eine hohe Lebensqualität und Frieden so selbstverständlich
                sind wie die Luft zum Atmen?
            </div>
            <v-btn color="secondary" class="action-button" @click="openExplainVideo">
                Zum Erklärvideo
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['showMobile'],
        computed: {
            explainVideo() {
                return `${process.env.staticUrl}/img/landingPagePublic/explainVideo.jpg`;
            },
        },
        methods: {
            openExplainVideo() {
                window.open('https://youtu.be/hcCvaH0RJj4', '_blank');
            }
        }
    }
</script>

<style lang="scss">
    .public-why-dumonda-me {
        .public-image {
            cursor: pointer;
        }
    }
</style>
