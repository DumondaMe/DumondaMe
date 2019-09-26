<template>
    <div class="dumonda-me-topic-card ely-card">
        <img :src="topicImage" class="topic-image"/>
        <h2>{{topic}}</h2>
        <div class="navigation-container">
            <v-btn small outlined fab color="primary">
                <v-icon size="18">mdi-help</v-icon>
            </v-btn>
            <v-btn small outlined fab color="primary">
                <v-icon size="18">mdi-human-handsup</v-icon>
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['topic', 'topicId'],
        data() {
            return {}
        },
        computed: {
            topicImage() {
                return `https://s3.eu-central-1.amazonaws.com/localtest.dumonda.me/topic/${this.topicId}/preview.jpg`;
            }
        },
        components: {},
        methods: {}
    }
</script>

<style lang="scss">
    .dumonda-me-topic-card.ely-card {
        max-width: 282px;
        padding-right: 0;
        padding-left: 0;
        padding-top: 0;
        margin-right: 18px;
        margin-bottom: 18px;

        .topic-image {
            max-width: 100%;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }

        h2 {
            text-align: center;
            padding: 0 8px;
            font-weight: 500;
            height: 60px;

        }

        .navigation-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 8px;

            .v-btn {
                margin-right: 8px;
                margin-left: 8px;
                margin-bottom: 8px;
            }
        }
    }
</style>
