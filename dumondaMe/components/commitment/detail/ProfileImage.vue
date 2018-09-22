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
            img {
                width: 100%;
                border-radius: 6px;
            }
        }
    }
</style>
