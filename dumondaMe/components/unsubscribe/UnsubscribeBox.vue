<template>
    <div id="message-box-unsubscribe" class="ely-card">
        <v-icon x-large class="email-icon">{{$icons.mdiEmailOutline}}</v-icon>
        <div class="unsubscribe-title">{{$t('pages:unsubscribe.title')}}</div>
        <div class="unsubscribe-description" v-html="unsubscribeDescription">
        </div>
    </div>
</template>

<script>
    import {mdiEmailOutline} from '@mdi/js';

    export default {
        props: ['unsubscribeDescription'],
        created() {
            this.$icons = {mdiEmailOutline};
        }
    }
</script>

<style lang="scss">
    #message-box-unsubscribe {
        margin: 0 auto;
        max-width: 350px;

        .email-icon {
            display: block;
            width: 40px;
            margin: 0 auto 12px auto;
        }

        .unsubscribe-title {
            font-size: 20px;
            margin-bottom: 12px;
            text-align: center;
            color: $primary-color;
        }

        .unsubscribe-description {
            text-align: center;
            font-weight: 300;
            padding: 0 12px;
        }
    }
</style>