<template>
    <div id="feed-help">
        <div class="description">
            Dein persönlicher Feed ist im Moment noch leer. Macht nichts! Wir zeigen dir wie du dies ändern kannst.
        </div>
        <h2 class="feed-help-title">Trust Circle</h2>
        <div class="image-text-container">
            <img :src="getTrustCircleImage">
            <div class="description">
                Füge Personen deren Meinung du schätzt, deinem Trust Circle hinzu. Dadurch siehst du in deinem Feed,
                wenn sie eine Frage erstellen, Fragen beantworten, Antworten zustimmen und noch vieles mehr.
            </div>
        </div>
        <h2 class="feed-help-title">Engagement beobachten</h2>
        <div class="text-container">
            <div class="description">
            </div>
        </div>
        <h2 class="feed-help-title">Frage beobachten</h2>
        <div class="text-container">
            <div class="description">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FeedHelp",
        computed: {
            getTrustCircleImage() {
                return `${process.env.staticUrl}/img/trustCircle.jpg`;
            }
        },
    }
</script>

<style lang="scss">
    #feed-help {
        margin-top: 32px;
        .description {
            font-weight: 300;
            margin-bottom: 18px;
        }
        .feed-help-title {
            margin-bottom: 8px;
        }
        .image-text-container {
            img {
                float: right;
                height: 150px;
                width: 150px;
            }
            .description {
                min-height: 150px;
                margin-right: 162px;
            }
        }
    }
</style>