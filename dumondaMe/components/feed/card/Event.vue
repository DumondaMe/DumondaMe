<template>
    <div class="event-feed-card">
        <div class="feed-card-header">
            <div>
                <h2 class="feed-card-title">
                    <span class="answer-type">Veranstaltung </span><span class="card-header-link">
                    <nuxt-link :to="{name: 'commitment-commitmentId-slug',
                        params: {commitmentId: event.commitmentId, slug: event.commitmentSlug},
                        query: {eventId: event.eventId}}">{{event.title}}
                    </nuxt-link></span>
                </h2>
                <div class="secondary-text">{{event.startDate | formatFromToDate(event.endDate, $t('common:at'))}}</div>
            </div>
        </div>
        <expand-text :expand-text="event.description" class="event-description" itemprop="text">
        </expand-text>
        <slot name="footer"></slot>
    </div>
</template>

<script>
    import ExpandText from '~/components/common/text/Expand'

    export default {
        props: ['event'],
        components: {ExpandText}
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