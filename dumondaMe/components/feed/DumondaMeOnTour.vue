<template>
    <div class="dumonda-me-on-tour-info ely-card">
        <div class="on-tour-title">{{$t('pages:feeds:harvesting.title')}}</div>
        <v-carousel class="on-tour-images" hide-delimiters height="270">
            <v-carousel-item v-for="event of events" :key="event.userId">
                <img class="on-tour-image" :src="event.image" @click="navigateToHarvestingUser(event)"/>
                <div class="event-title" @click="navigateToHarvestingUser(event)">{{event.name}}</div>
            </v-carousel-item>
        </v-carousel>
        <div class="on-tour-description">
            {{$t('pages:feeds:harvesting.description')}}
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        computed: {
            events() {
                return this.$store.state.feed.harvestingEvents;
            }
        },
        methods: {
            navigateToHarvestingUser(event) {
                this.$router.push({
                    name: 'dumondaMeOnTour-userId', params: {userId: event.userId}
                })
            }
        }
    }
</script>

<style lang="scss">
    .dumonda-me-on-tour-info {
        margin-bottom: 18px;
        max-width: 360px;
        margin-left: auto;
        margin-right: auto;

        .on-tour-title {
            @include defaultPaddingCard();
            font-weight: 500;
            padding-bottom: 12px;
        }

        .on-tour-images {
            height: 300px;
            position: relative;

            .on-tour-image {
                width: 100%;
                cursor: pointer;
            }

            .event-title {
                position: absolute;
                bottom: 0;
                padding: 4px 8px;
                cursor: pointer;
                width: 100%;
                text-align: center;
                font-weight: 500;
                font-size: 20px;
                color: white;
                background: rgb(0, 0, 0, 0.5);

            }

            .event-title:hover {
                text-decoration: underline;
            }
        }

        .on-tour-description {
            @include defaultPaddingCard();
            margin-top: 12px;
            font-weight: 300;
        }
    }
</style>
