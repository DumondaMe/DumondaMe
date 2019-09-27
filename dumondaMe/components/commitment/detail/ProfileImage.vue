<template>
    <div id="dumonda-me-commitment-image">
        <div id="commitment-image">
            <img :src="commitment.imageUrl"/>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {showLoginRequired: false}
        },
        computed: {
            ...mapGetters({commitment: 'commitment/getCommitment'})
        }
    }
</script>

<style lang="scss">
    #dumonda-me-commitment-image {
        #commitment-image {
            width: 320px;
            margin-left: 40px;
            @media screen and (max-width: $sm) {
                width: 280px;
                margin-left: auto;
            }
            @media screen and (max-width: $xs) {
                margin-top: 18px;
                margin-left: 0px;
            }
            @media screen and (max-width: 340px) {
                width: 288px;
            }
            img {
                width: 100%;
                border-radius: 4px;
                border: 1px solid $divider;
            }
        }
    }
</style>
