<template>
    <div class="user-commitment-info">
        <div class="commitment-content">
            <div class="commitment-image">
                <img :src="commitment.imageUrl"/>
            </div>
            <div>
                <div class="commitment-title" @click="$router.push({name: 'commitment-commitmentId-slug',
                     params: {commitmentId: commitment.commitmentId, slug: commitment.slug}})">
                    {{commitment.title}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['commitment']
    }
</script>

<style lang="scss">
    .user-commitment-info {
        margin-bottom: 8px;
        .commitment-content {
            display: flex;
            .commitment-image {
                margin-right: 18px;
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
            }
            .commitment-title {
                cursor: pointer;
                color: $primary-color;
                font-size: 16px;
                font-weight: 400;
            }
            :hover.commitment-title {
                text-decoration: underline;
            }
        }
    }
</style>
