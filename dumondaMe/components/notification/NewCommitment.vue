<template>
    <div class="notification-new-commitment">
        <div class="notification-created">{{notification.created | formatRelativeTimesAgo}}</div>
        <div class="notification-title">
            <span v-html="$t('pages:notifications.newCommitment.notification', {commitment})">
            </span>
        </div>
        <div class="notification-content">
            <div class="commitment-image">
                <img :src="notification.commitmentImage"/>
            </div>
            <div class="commitment-description">
                {{notification.commitmentDescription}}
            </div>
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
    .notification-new-commitment {
        font-weight: 300;

        .notification-content {
            display: flex;
            margin-top: 12px;

            .commitment-image {
                width: 120px;
                height: 90px;
                flex-shrink: 0;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .commitment-description {
                padding-left: 12px;
                font-size: 16px;
                font-style: italic;
            }
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