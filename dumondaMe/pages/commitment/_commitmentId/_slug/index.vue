<template>
    <detail-layout>
        <div slot="content" id="commitment-detail">
            <div class="user-mobile-content">
                <profile-image></profile-image>
            </div>
            <commitment-header>
            </commitment-header>
            <div class="user-mobile-content">
                <general-information></general-information>
            </div>
            <notifications>
            </notifications>
            <questions>
            </questions>
            <events>
            </events>
        </div>
        <div slot="sidebar" id="commitment-sidebar">
            <profile-image></profile-image>
            <general-information></general-information>
        </div>
    </detail-layout>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail';
    import CommitmentHeader from '~/components/commitment/detail/Header';
    import ProfileImage from '~/components/commitment/detail/ProfileImage';
    import Notifications from '~/components/commitment/detail/notifications/Notifications';
    import Questions from '~/components/commitment/detail/Questions';
    import Events from '~/components/commitment/detail/event/Events';
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
                htmlAttrs: {
                    lang: this.commitment.lang
                },
                meta: [
                    {hid: 'description', name: 'description', content: this.commitment.description}
                ]
            }
        },
        components: {
            DetailLayout, CommitmentHeader, ProfileImage, Notifications, Questions, Events, GeneralInformation
        },
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
        .user-mobile-content {
            @media screen and (min-width: $xs) {
                display: none;
            }
        }
    }

    #commitment-sidebar {
        width: 100%;
        .sidebar-container {
            width: 100%;
            margin-top: 32px;
            h3 {
                font-size: 16px;
                border-bottom: 1px solid #ddd;
                margin-bottom: 12px;
            }
        }
    }
</style>
