<template>
    <div class="harvesting-event ely-card feed-card">
        <div class="feed-card-header">
            <h2 class="feed-card-title">
                <span class="card-header-link">
                    <nuxt-link :to="{name: 'dumondaMeOnTour-userId',
                            params: {userId: event.userId}}"> {{event.name}}
                    </nuxt-link></span>
            </h2>
        </div>
        <div class="harvesting-event-image">
            <img v-lazy="event.image">
        </div>
    </div>
</template>

<script>


    export default {
        props: ['event'],
        components: {},
        computed: {},
        methods: {}
    }
</script>

<style lang="scss">
    .harvesting-event {

        .harvesting-event-image {
            width: 100%;
            cursor: pointer;

            img {
                width: 100%;
            }
        }
    }
</style>
