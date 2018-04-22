<template>
    <div class="expand-text-container">
        <p :class="{'expand': expandDescription}" ref="expandElement">{{expandText}}</p>
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
        mounted(){
            this.isMounted = true;
        }
    }
</script>

<style lang="scss">
    .expand-text-container {
        p {
            font-weight: 300;
            font-size: 16px;
            line-height: 1.6em;
            max-height: 8em;
            overflow-y: hidden;
            overflow-x: hidden;
            margin-bottom: 0;
        }
        p.expand {
            max-height: none;
            white-space: pre-wrap;
        }
        .expanse-button {
            display: inline-block;
            font-size: 12px;
            color: $secondary-text;
            cursor: pointer;
        }
        :hover.expanse-button {
            text-decoration: underline;
        }
    }
</style>
