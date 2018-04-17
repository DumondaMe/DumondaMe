<template>
    <div id="elyoos-commitment-header">
        <div id="commitment-image">
            <img :src="commitment.imageUrl"/>
        </div>
        <div id="commitment-infos">
            <h1>{{commitment.title}}</h1>
            <p id="commitment-description">{{commitment.description}}</p>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        components: {},
        data() {
            return {}
        },
        computed: {
            ...mapGetters({commitment: 'commitment/getCommitment'})
        },
        methods: {}
    }
</script>

<style lang="scss">
    #elyoos-commitment-header {
        padding-bottom: 8px;
        margin-bottom: 24px;
        border-bottom: 1px solid $divider;
        #commitment-image {
            float: left;
            width: 142px;
            img {
                width: 100%;
                border-radius: 6px;
            }
        }
        #commitment-infos {
            margin-left: 142px;
            padding-left: 18px;
            min-height: 142px;
            h1 {
                margin-bottom: 4px;
                font-size: 28px;
                line-height: 28px;
            }
            #commitment-description {
                margin-top: 12px;
                font-size: 16px;
                font-weight: 300;
                white-space: pre-line;
                word-break: break-word;
            }
        }
    }
</style>
