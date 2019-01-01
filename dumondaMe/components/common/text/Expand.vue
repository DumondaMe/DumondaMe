<template>
    <div class="expand-text-container">
        <p :class="{'expand': expandDescription}" ref="expandElement" itemprop="text">
            <span v-html="expandText"></span></p>
        <div v-show="showTextExpanse && !expandDescription" class="expanse-button"
             @click="expandDescription = true">{{$t('common:button.readMore')}}
        </div>
    </div>
</template>

<script>
    export default {
        props: ['expandText'],
        data() {
            return {expandDescription: false, isMounted: false}
        },
        computed: {
            showTextExpanse() {
                if (this.isMounted) {
                    return this.$refs.expandElement.scrollHeight > this.$refs.expandElement.clientHeight;
                }
                return false;
            }
        },
        mounted() {
            this.isMounted = true;
        }
    }
</script>

<style lang="scss">
    .expand-text-container {
        p {
            width: 100%;
            font-weight: 300;
            font-size: 16px;
            line-height: 1.6em;
            max-height: 8em;
            overflow-y: hidden;
            overflow-x: hidden;
            word-break: break-word;
            margin-bottom: 0;
        }
        p.expand {
            max-height: none !important;
            white-space: pre-wrap;
        }
        .expanse-button {
            display: inline-block;
            vertical-align: top;
            font-size: 12px;
            line-height: 16px;
            color: $secondary-text;
            cursor: pointer;
        }
        :hover.expanse-button {
            text-decoration: underline;
        }
    }
</style>
