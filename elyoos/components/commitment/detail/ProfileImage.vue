<template>
    <div id="elyoos-commitment-image">
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
    #elyoos-commitment-image {
        #commitment-image {
            width: 320px;
            height: 320px;
            img {
                width: 100%;
                height: 100%;
                border-radius: 6px;
            }
        }
    }
</style>
