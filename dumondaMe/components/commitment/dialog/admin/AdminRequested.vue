<template>
    <div class="requested-admin-of-commitment">
        <div class="admin-image">
            <img :src="admin.profileUrl"/>
        </div>
        <div class="admin-content">
            <div class="admin-name">{{admin.name}}</div>
        </div>
    </div>
</template>

<script>

    export default {
        props: ['admin']
    }
</script>

<style lang="scss" scoped>
    .requested-admin-of-commitment {
        display: flex;
        margin-bottom: 18px;

        .admin-image {
            height: 40px;
            width: 40px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }

        .admin-content {
            margin-left: 12px;

            .admin-name {
                font-weight: 500;
            }
        }
    }
</style>
