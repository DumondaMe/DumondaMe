<template>
    <div class="public-privacy explanation-element">
        <div class="public-image">
            <img :src="privacy">
        </div>
        <div class="public-description-container transparency-container">
            <h2 class="title-description">Datenschutz</h2>
            <div class="description">
                Deine privaten Daten bleiben bei DumondaMe und werden nicht an Dritte weitergegeben.
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            privacy() {
                return `${process.env.staticUrl}/img/landingPagePublic/privacy.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-privacy.explanation-element {
    }
</style>
