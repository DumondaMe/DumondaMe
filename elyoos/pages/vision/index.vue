<template>
    <div id="ely-vision">
        <div v-if="selectedLanguage === 'de'">
            <h1>Unsere Vision</h1>
            <p>Wie verändern wir die Welt zu einem Ort, wo ein nachhaltiger Umgang mit der Natur, soziale Gerechtigkeit
                und Frieden so selbstverständlich sind wie die Luft zum Atmen? Um dies zu verwirklichen ist es
                unabdingbar, dass wir die notwendigen Fragen stellen und die passenden Antworten umsetzen. Dazu braucht
                es Engagement in vielen verschiedenen Themenbereichen wie z.Bsp. Politik, Wirtschaft, Gesellschaftliche
                Entwicklung, Umweltschutz, Spiritualität, Gesundheit, Bildung usw.</p>
            <p>Elyoos soll als Katalysator dienen, welcher die bereits vorhanden Lösungsvorschläge sichtbar macht und
                das Erarbeiten von Neuen unterstützt. Deshalb nutzt dieses soziale Netzwerke die Vorteile des Internets,
                um mit vereinten Kräften einen Paradigmenwechsel zu ermöglichen. Einer welcher uns nicht länger nur von
                einer besseren Zukunft träumen lässt, sondern diese in die Gegenwart bringt.</p>
        </div>
        <div v-else-if="selectedLanguage === 'en'">
            <h1>Our Vision</h1>
            <p>How do we change the world into a place where sustainable interaction with nature, social justice and
                peace are as natural as the air we breathe? To achieve this, it is essential that we ask the necessary
                questions and implement the appropriate answers. This requires commitment in many different areas such
                as politics, economics, social development, environmental protection, spirituality, health, education,
                etc.</p>
            <p>Elyoos should serve as a catalyst, which makes the already existing solution proposals visible and
                supports the development of new ones. Therefore, this social network uses the advantages of the Internet
                to enable a paradigm shift with combined forces. One that no longer only makes us dream of a better
                future, but brings it into the present.</p>
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
        h1 {
            font-size: 24px;
            font-weight: 400;
            margin-bottom: 8px;
        }
        p {
            font-weight: 300;
            font-size: 16px;
            line-height: 24px;
        }
    }
</style>