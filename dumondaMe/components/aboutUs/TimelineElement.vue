<template>
    <v-timeline-item :color="color" :icon="icon" fill-dot class="about-us-timeline-element">
        <span slot="opposite" class="headline year-description">{{date}}</span>
        <v-card :color="color" dark>
            <v-card-title class="title">{{timelineTitle}}</v-card-title>
            <v-card-text class="white text--primary">
                <div class="date-mobile">{{date}}</div>
                <p v-html="timelineText"></p>
                <slot name="info"></slot>
            </v-card-text>
        </v-card>
    </v-timeline-item>
</template>

<script>
    export default {
        props: ['color', 'icon', 'date', 'timelineTitle', 'timelineText'],
    }
</script>

<style lang="scss">
    .about-us-timeline-element {
        .white.text--primary {
            padding-top: 12px;
        }

        .title {
            word-break: normal;
        }

        .date-mobile {
            font-weight: 500;
            margin-bottom: 8px;
            @media screen and (min-width: 600px) {
                display: none;
            }
        }

        .v-timeline-item__opposite {
            align-self: start;
            margin-top: 12px;

            .headline.year-description {
                font-size: 20px !important;
                line-height: 20px !important;
            }
        }

        .social-media-links-inner-container {
            margin-top: 18px;
        }

        p {
            margin-bottom: 0;
        }
    }
</style>
