<template>
    <detail-layout>
        <div slot="content" id="commitment-detail">
            <commitment-header>
            </commitment-header>
            <notifications>
            </notifications>
            <questions>
            </questions>
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
    import DetailLayout from '~/components/layouts/Detail';
    import CommitmentHeader from '~/components/commitment/detail/Header';
    import Notifications from '~/components/commitment/detail/notifications/Notifications';
    import Questions from '~/components/commitment/detail/Questions';
    import Admin from '~/components/commitment/detail/Admin';
    import GeneralInformation from '~/components/commitment/detail/GeneralInformation';
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
        components: {DetailLayout, CommitmentHeader, Notifications, Questions, Admin, GeneralInformation},
        computed: {
            ...mapGetters({commitment: 'commitment/getCommitment'})
        }
    }
</script>

<style lang="scss">
    #commitment-detail {
        margin-bottom: 48px;
        h2 {
            font-size: 16px;
            font-weight: 400;
            margin-top: 32px;
            margin-bottom: 12px;
            border-bottom: 1px solid $divider;
        }
    }

    #commitment-sidebar {
        width: 100%;
        .sidebar-container {
            width: 100%;
            margin-bottom: 32px;
            h3 {
                font-size: 16px;
                border-bottom: 1px solid #ddd;
                margin-bottom: 12px;
            }
        }
    }
</style>
