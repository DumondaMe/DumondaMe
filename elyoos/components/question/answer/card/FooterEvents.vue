<template>
    <div class="commitment-events-footer">
        <div class="event" v-for="event in events">
            <div class="event-title">{{event.title}}</div>
            <div class="event-infos">
                <div class="footer-icon">
                    <v-icon>mdi-clock</v-icon>
                    <span class="footer-text">{{event.startDate | formatFromToDate(event.endDate, $t('common:at'))}}</span>
                </div>
                <div class="footer-icon">
                    <v-icon>mdi-map-marker</v-icon>
                    <span class="footer-text">{{event.location}} ({{$t("regions:" + event.region)}})</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['events']
    }
</script>

<style lang="scss">
    .commitment-events-footer {
        margin-top: 22px;
        border-top: 1px solid $divider;
        .event {
            margin-top: 14px;
            .event-title {
                font-size: 12px;
                white-space: nowrap;
                overflow-x: hidden;
                text-overflow: ellipsis;
            }
            .event-title:hover {
                text-overflow: clip;
                white-space: normal;
            }
            .event-infos {
                .footer-icon {
                    margin-left: -1px;
                    i.icon {
                        font-size: 16px;
                    }
                    .footer-text {
                        margin-left: 4px;
                        font-size: 12px;
                        font-weight: 400;
                        color: $secondary-text;
                    }
                }
            }
        }
    }
</style>
