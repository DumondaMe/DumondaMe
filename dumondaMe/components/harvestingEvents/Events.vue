<template>
    <div id="harvesting-events-container">
        <event :event="event" v-for="event in events" :key="event.userId">
        </event>
    </div>
</template>

<script>
    import Event from './Event';

    export default {
        components: {Event},
        computed: {
            isLoadingFeed() {
                return this.$store.state.harvestingEvents.loading;
            },
            events() {
                return this.$store.state.harvestingEvents.events;
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    #harvesting-events-container {

        @media screen and (max-width: $xs) {
            .feed-card {
                margin: 4px auto;
            }
        }
    }
</style>
