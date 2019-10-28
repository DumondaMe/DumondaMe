<template>
    <div class="drawer-navigation-item" @click="navigate" :class="{'is-actual-route': isActualRoute}">
        <v-badge v-if="badgeCount > 0" overlap color="secondary">
            <template v-slot:badge> {{badgeCount}}</template>
            <v-icon>{{icon}}</v-icon>
        </v-badge>
        <v-icon v-else>{{icon}}</v-icon>
        <span class="navigation-text">{{navText}}</span>
    </div>
</template>

<script>
    export default {
        props: ['nuxtLink', 'icon', 'navText', 'badgeCount', 'params', 'query'],
        computed: {
            isActualRoute() {
                return this.nuxtLink === this.$route.name;
            }
        },
        methods: {
            navigate() {
                if (this.query) {
                    this.$router.push({name: this.nuxtLink, query: this.query})
                } else if (this.params) {
                    debugger
                    this.$router.push({name: this.nuxtLink, params: this.params})
                } else {
                    this.$router.push({name: this.nuxtLink})
                }
            }
        }
    }
</script>

<style lang="scss">
    #navigation-drawer {
        .drawer-navigation-item {
            padding: 7px 0 7px 10px;
            margin-top: 7px;
            margin-bottom: 7px;
            display: flex;
            cursor: pointer;

            .navigation-text {
                text-decoration: none;
                margin-left: 28px;
                font-size: 16px;
                font-weight: 500;
                line-height: 24px;
                height: 24px;
                letter-spacing: 0.5px;
                color: $secondary-text;
            }
        }

        a.drawer-navigation-item {
            text-decoration: none;
            display: flex;
            color: $secondary-text;
        }

        .drawer-navigation-item:hover {
            background-color: $selected;
            border-radius: 4px;
        }

        .drawer-navigation-item.is-actual-route {
            border-radius: 4px;

            a {
                color: $primary-color;
            }

            .navigation-text {
                color: $primary-color;
            }

            .v-icon {
                color: $primary-color;
            }
        }
    }
</style>