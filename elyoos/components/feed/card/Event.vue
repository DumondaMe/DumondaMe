<template>
    <div class="event-feed-card">
        <div class="feed-card-header">
            <span class="answer-type">Veranstaltung </span><span class="card-header-link">
                <a :href="getEventLink">{{event.title}}</a></span>
        </div>
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
            },
            getEventLink() {
                return `/commitment/${this.event.commitmentId}/${this.event.commitmentSlug}?eventId=${this.event.eventId}`;
            }
        }
    }
</script>

<style lang="scss">
    .event-feed-card {
        .title-container {
            margin-bottom: 12px;
            .event-icon {
                font-size: 18px;
                margin-right: 8px;
            }
            .event-title {
                color: $primary-color;
            }
        }
        .event-description {
            margin-bottom: 16px;
        }
    }
</style>