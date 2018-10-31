<template>
    <div id="dumonda-me-regions" class="ely-card">
        <div id="number-of-regions">
            <nuxt-link to="/regions">{{regions.length}}
                {{$t('pages:home.region.numberOfRegions', {count: regions.length})}}
            </nuxt-link>
        </div>
        <div class="region" v-for="region in regions">
            {{region.region}}
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        computed: {
            regions() {
                return this.$store.state.home.regions;
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-regions {
        margin-right: 28px;
        margin-bottom: 40px;
        display: inline-block;
        width: 300px;
        height: 400px;
        overflow-y: auto;

        #number-of-regions {
            font-weight: 300;
            margin-bottom: 18px;
            a {
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        }
        .region {
            margin-bottom: 8px;
        }
    }
</style>
