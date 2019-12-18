<template>
    <div class="contributor">
        <div class="contributor-image" @click="navigateToUserProfile">
            <img :src="contributor.profileUrl"/>
        </div>
        <div>
            <div class="contributor-name" @click="navigateToUserProfile">
                <span v-if="contributor.isLoggedInUser">{{$t('common:you')}}</span>
                <span v-else>{{contributor.name}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['contributor'],
        methods: {
            navigateToUserProfile() {
                if (this.contributor.isLoggedInUser) {
                    this.$router.push({name: 'user'})
                } else {
                    this.$router.push({
                        name: 'user-userId-slug', params: {
                            userId: this.contributor.userId, slug: this.contributor.slug
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    .contributor {
        margin-bottom: 8px;
        display: flex;

        .contributor-image {
            margin-right: 18px;

            img {
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
            }
        }

        .contributor-name {
            cursor: pointer;
            color: $primary-text;
            font-size: 16px;
            font-weight: 400;
        }

        :hover.contributor-name {
            text-decoration: underline;
        }
    }
</style>
