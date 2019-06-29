<template>
    <div class="public-commitments explanation-element">
        <div class="public-image" @click="$router.push({name: 'commitment'})">
            <img :src="commitment">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">Dein Engagement</h2>
            <div class="description">
                Erstelle auf DumondaMe eine Seite für deine Organisation (Bezeichnung Engagement auf DumondaMe). Nutze
                dieses Feature um interessierte Menschen auf deine Organisation aufmerksam zu machen und um mit ihnen im
                Austausch zu bleiben. Zudem kannst du dein Engagement mit Fragen verlinken und so konkret aufzeigen, mit
                welchen Themen sich deine Organisation beschäftigt.
            </div>
            <v-btn color="secondary" class="action-button" @click="$router.push({name: 'commitment'})">
                Zu den Engagements
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
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
