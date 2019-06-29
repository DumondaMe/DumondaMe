<template>
    <div class="public-for-the-good-of-all explanation-element">
        <div class="public-image">
            <img :src="networking">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">Zum Wohle Aller</h2>
            <div class="description">
                Die Gemeinnützigkeit ist in der DNA von DumondaMe verankert. Mit DumondaMe werden die vollen
                Möglichkeiten zur Verwendung von kollektiver Intelligenz im Dienst der Allgemeinheit nutzbar.
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            networking() {
                return `${process.env.staticUrl}/img/landingPagePublic/forTheGoodOfAll.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-for-the-good-of-all {

    }
</style>
