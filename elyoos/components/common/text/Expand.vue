<template>
    <div class="expand-text-container">
        <p :class="{'expand': expandDescription}" ref="expandDescriptionElement">{{expandText}}</p>
        <div v-show="showTextExpanse && !expandDescription" class="expanse-button"
             @click="expandDescription = true">{{$t('common:button.readMore')}}
        </div>
    </div>
</template>

<script>
    export default {
        props: ['expandText'],
        data() {
            return {expandDescription: false}
        },
        computed: {
            showTextExpanse() {
                if (this.$refs.expandDescriptionElement) {
                    return this.$refs.expandDescriptionElement.scrollHeight >
                        this.$refs.expandDescriptionElement.clientHeight;
                }
                return true;
            }
        }
    }
</script>

<style lang="scss">
    .expand-text-container {
        p {
            font-weight: 300;
            font-size: 16px;
            white-space: pre-wrap;
            line-height: 1.6em;
            max-height: 8em;
            overflow-y: hidden;
            margin-bottom: 4px;
        }
        p.expand {
            max-height: none;
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
