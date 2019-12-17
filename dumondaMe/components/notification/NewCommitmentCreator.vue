<template>
    <div class="notification-new-commitment-creator">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-title">
            <span v-html="$t('pages:notifications.newCommitmentCreator.title', {commitment})">
            </span>
        </div>
        <div class="notification-content">
            {{$t('pages:notifications.newCommitmentCreator.description')}}
        </div>
    </div>
</template>

<script>
    import Users from './Users';

    export default {
        props: ['notification'],
        components: {Users},
        computed: {
            commitment() {
                return `<a class="commitment-title"` +
                    `href="/commitment/${this.notification.commitmentId}/${this.notification.commitmentSlug}">` +
                    `${this.notification.commitmentTitle}</a>`
            }
        }
    }
</script>

<style lang="scss">
    .notification-new-commitment-creator {
        font-weight: 300;

        .notification-title {
            font-weight: 400;
            margin-bottom: 8px;
        }

        .commitment-title {
            font-weight: 400;
            color: $primary-color;
            text-decoration: none;
        }

        :hover.commitment-title {
            text-decoration: underline;
        }
    }
</style>