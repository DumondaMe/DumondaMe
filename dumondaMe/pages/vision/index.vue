<template>
    <div id="ely-vision">
        <div v-if="selectedLanguage === 'de'">
            <h1>Unsere Vision</h1>
            <p>Wie verändern wir die Welt zu einem Ort, wo ein nachhaltiger Umgang mit der Natur, soziale Gerechtigkeit,
                eine hohe Lebensqualität und Frieden so selbstverständlich ist wie die Luft zum Atmen? Um dies zu
                verwirklichen ist es unabdingbar, dass wir die notwendigen Fragen stellen und die passenden Antworten
                umsetzen. Dazu braucht es Engagement in verschiedenen Themenbereichen wie Umweltschutz, Wirtschaft,
                Gesundheit, Bildung, Spiritualität und vielen mehr.</p>
            <p>DumondaMe dient als Katalysator, welcher die bereits vorhanden Lösungsvorschläge sichtbar macht und das
                Erarbeiten von neuen unterstützt. Das soziale Netzwerk nutzt dabei das Potenzial des Internets, um mit
                vereinten Kräften einen Paradigmenwechsel zu ermöglichen. Einer welcher uns nicht länger nur von einer
                besseren Zukunft träumen lässt, sondern diese in die Gegenwart bringt.</p>
        </div>
        <div v-else-if="selectedLanguage === 'en'">
            <h1>Our Vision</h1>
            <p>How do we change the world into a place where a sustainable interaction with nature, social justice, a
                high quality of life and peace are as self-evident as the air we breathe? In order to achieve this, it
                is indispensable that we ask the necessary questions and implement the appropriate answers. This
                requires commitment in various areas such as environmental protection, the economy, health, education,
                spirituality and many more.</p>
            <p>DumondaMe serves as a catalyst, which makes already existing solutions visible and supports the
                development of new ones. The social network uses the potential of the Internet in order to enable a
                paradigm shift with united forces. One that no longer lets us only dream of a better future, but brings
                it into the present.</p>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            selectedLanguage() {
                return this.$store.state.i18n.language
            }
        }
    }
</script>

<style lang="scss">
    #ely-vision {
        max-width: 600px;
        margin: 0 auto;
        @media screen and (max-width: $xs) {
            margin-top: 18px;
            padding: 0 16px;
        }
        h1 {
            font-size: 52px;
            line-height: 60px;
            margin-bottom: 18px;

            @media screen and (max-width: $xs) {
                font-size: 28px;
            }
        }
        p {
            font-weight: 300;
            font-size: 16px;
            line-height: 24px;
        }
    }
</style>