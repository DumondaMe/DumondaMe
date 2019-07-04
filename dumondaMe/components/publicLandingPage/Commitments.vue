<template>
    <div class="public-commitments explanation-element">
        <div class="public-image" @click="$router.push({name: 'commitment'})" v-if="!showMobile">
            <img :src="commitment">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">Dein Engagement</h2>
            <div class="public-image" @click="$router.push({name: 'commitment'})" v-if="showMobile">
                <img :src="commitment">
            </div>
            <div class="description">
                Erstelle auf DumondaMe eine Seite für deine Organisation, dein Projekt oder deine persönliche Initiative
                (Bezeichnung Engagement auf DumondaMe). Nutze dieses Feature um interessierte Menschen auf dein
                Engagement aufmerksam zu machen und um mit ihnen im Austausch zu bleiben.
            </div>
            <v-btn color="secondary" class="action-button" @click="$router.push({name: 'commitment'})">
                Zu den Engagements
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['showMobile'],
        computed: {
            commitment() {
                return `${process.env.staticUrl}/img/landingPagePublic/commitment.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-commitments {
        .public-image {
            cursor: pointer;
        }
    }
</style>
