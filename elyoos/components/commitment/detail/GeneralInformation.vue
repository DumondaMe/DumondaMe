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
        <div class="commitment-info regions">
            <v-icon class="info-icon">location_on</v-icon>
            <div id="region-container">
                <div v-for="region in commitment.regions">{{$t("regions:" + region)}}</div>
            </div>
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
        font-weight: 300;
        width: 100%;
        #topic-container {
            margin-left: 30px;
            .topic {
                font-size: 14px;
            }
        }
        .info-icon {
            margin-top: 2px;
            float: left;
            margin-right: 12px;
            font-size: 18px;
            color: #90A4AE;
        }
        #region-container {
            margin-left: 30px;
        }
        a {
            display: block;
            margin-left: 30px;
            max-width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    }

    .commitment-info.topics {
        .info-icon {
            margin-top: 2px;
        }
    }
    .commitment-info.regions {
        .info-icon {
            margin-top: 2px;
        }
    }
</style>
