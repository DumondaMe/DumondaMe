<template>
    <div class="dumonda-me-crowdfunding-container">
        <div class="ely-card dumonda-me-crowdfunding-card">
            <iframe frameborder="0" scrolling="no"
                    src="https://wemakeit.com/widgets/projects/dumondame?type=regular"
                    :width="previewWidth" :height="previewHeight"></iframe>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            previewWidth() {
                if (typeof window !== 'undefined' && window.innerWidth < 450) {
                    return 320
                }
                return 322;
            },
            previewHeight() {
                return 450;
            }
        }
    }
</script>

<style lang="scss">
    .dumonda-me-crowdfunding-container {
        margin-top: 58px;
        @media screen and (min-width: $xs) {
            margin-top: 32px;
        }

        .dumonda-me-crowdfunding-card {
            @media screen and (min-width: $xs) {
                margin-bottom: 18px;
            }

            iframe {
                display: block;
                margin: 0 auto;
            }
        }
    }
</style>
