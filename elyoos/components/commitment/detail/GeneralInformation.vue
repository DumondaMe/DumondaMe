<template>
    <div class="sidebar-container">
        <h3>{{$t("pages:detailCommitment.generalInfo.title")}}</h3>
        <div class="commitment-info topics">
            <v-icon class="info-icon">vpn_key</v-icon>
            <div id="topic-container">
                <span class="topic" v-for="(topic, index) in commitment.topics">
                    {{topic}}<span v-if="index < commitment.topics.length - 1">, </span></span>
            </div>
        </div>
        <div class="commitment-info" v-if="commitment.website">
            <v-icon class="info-icon">language</v-icon>
            <a target="_blank" :href="commitment.website">{{website}}</a>
        </div>
        <div class="commitment-info">
            <v-icon class="info-icon">location_on</v-icon>
            <span>{{$t("regions:" + commitment.region)}}</span>
        </div>
    </div>
</template>

<script>
    import language from '~/mixins/languages.js';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [language],
        computed: {
            website() {
                return this.commitment.website.replace(/(^\w+:|^)\/\//, '')
            },
            ...mapGetters({commitment: 'commitment/getCommitment'})
        }
    }
</script>

<style lang="scss">
    .commitment-info {
        font-size: 14px;
        margin-bottom: 3px;
        #topic-container {
            margin-left: 30px;
            .topic {
                font-size: 14px;
            }
        }
        .info-icon {
            margin-right: 12px;
            font-size: 18px;
            color: #90A4AE;
        }
        a {
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    }
    .commitment-info.topics {
        .info-icon {
            margin-top: 2px;
            float: left;
        }
    }
</style>
