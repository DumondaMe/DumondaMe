<template>
    <div class="public-live-event">
        <v-icon x-large class="icon-calendar">mdi-calendar-check</v-icon>
        <h2>{{$t('pages:landingPagePublic.liveEvents.title')}}</h2>
        <div class="description-event">
            {{$t('pages:landingPagePublic.liveEvents.description')}}
        </div>
        <div class="next-event-title">{{$t('pages:landingPagePublic.liveEvents.titleNextEvents')}}</div>
        <a class="event-container" href="https://www.facebook.com/events/697106464081806/" target="_blank"
           rel="noopener">
            28. August: DumondaMe-Abend in Zürich
        </a>
    </div>
</template>

<script>
    export default {
    }
</script>

<style lang="scss">
    .public-live-event {
        margin-top: 102px;
        padding-top: 22px;
        height: 340px;
        background-color: #BA68C8;

        @media screen and (max-width: 900px) {
            margin-top: 38px;
            margin-bottom: 38px;
            padding-left: 16px;
            padding-right: 16px;
        }

        .icon-calendar {
            display: block;
            text-align: center;
            color: white;
        }

        h2 {
            margin-top: 12px;
            text-align: center;
            color: white;
            font-weight: 500;
            font-size: 32px;

        }

        .description-event {
            margin: 0 auto;
            text-align: center;
            max-width: 600px;
            color: white;
        }

        .next-event-title {
            margin-top: 32px;
            margin-bottom: 8px;
            font-size: 18px;
            text-align: center;
            color: white;
            font-weight: 500;
        }

        .event-container {
            display: block;
            text-align: center;
            color: white;
            cursor: pointer;
        }
    }
</style>
