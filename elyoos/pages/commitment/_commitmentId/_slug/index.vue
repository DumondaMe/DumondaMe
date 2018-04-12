<template>
    <detail-layout>
        <div slot="content" id="commitment-detail">
            <commitment-header>
            </commitment-header>
        </div>
        <div slot="sidebar" id="commitment-sidebar">
            <admin v-if="commitment.isAdmin">
            </admin>
            <general-information>
            </general-information>
        </div>
    </detail-layout>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail.vue';
    import CommitmentHeader from '~/components/commitment/detail/Header.vue';
    import Admin from '~/components/commitment/detail/Admin.vue';
    import GeneralInformation from '~/components/commitment/detail/GeneralInformation.vue';
    import {mapGetters} from 'vuex';

    export default {
        async fetch({params, store, error}) {
            try {
                await store.dispatch(`commitment/getCommitment`, params.commitmentId);
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
        components: {DetailLayout, CommitmentHeader, Admin, GeneralInformation},
        computed: {
            ...mapGetters({commitment: 'commitment/getCommitment'})
        }
    }
</script>

<style lang="scss">
    #commitment-detail {

    }

    #commitment-sidebar {
        .sidebar-container {
            margin-bottom: 32px;
            h3 {
                font-size: 16px;
                border-bottom: 1px solid #ddd;
                margin-bottom: 12px;
            }
        }
    }
</style>
