<template>
    <div class="event-feed-card">
        <div class="event-title">{{event.title}}</div>
        <expand-text :expand-text="event.description" class="event-description" itemprop="text"
                     v-if="event.description">
        </expand-text>
        <card-footer :creator="event.commitmentTitle" :creatorId="event.commitmentId"
                     :creatorSlug="event.commitmentSlug" :location="event.location" :region="event.region"
                     :start-date="event.startDate" :end-date="event.endDate">
        </card-footer>
    </div>
</template>

<script>
    import CardFooter from './footer/Event';
    import ExpandText from '~/components/common/text/Expand'

    export default {
        props: ['event'],
        components: {CardFooter, ExpandText},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
    }
</script>

<style lang="scss">
    .event-feed-card {
        .event-title {
            color: $primary-color;
        }
        .event-description {
            margin-top: 8px;
        }
    }
</style>