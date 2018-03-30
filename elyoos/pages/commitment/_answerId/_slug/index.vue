<template>
    <detail-layout>
        <div slot="content" id="commitment-detail">
            <commitment-header>
            </commitment-header>
        </div>
        <div slot="sidebar">

        </div>
    </detail-layout>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail.vue';
    import CommitmentHeader from '~/components/commitment/detail/Header.vue';
    import {mapGetters} from 'vuex';

    export default {
        async fetch({params, store, error}) {
            try {
                await store.dispatch(`commitment/getCommitment`, params.answerId);
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        head() {
            return {
                title: this.commitment.title,
                meta: [
                    {hid: 'description', name: 'description', content: this.commitment.description}
                ]
            }
        },
        components: {DetailLayout, CommitmentHeader},
        computed: {
            ...mapGetters({commitment: 'commitment/getCommitment'})
        }
    }
</script>

<style lang="scss">
    #commitment-detail {

    }
</style>
