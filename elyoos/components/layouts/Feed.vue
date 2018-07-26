<template>
    <div id="feed-layout">
        <div id="feed-sidebar">
            <slot name="sidebar"></slot>
        </div>
        <div id="feed-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<style lang="scss">
    #feed-layout {
        #feed-sidebar {
            float: left;
            width: 280px;
            @media screen and (max-width: $sm) {
                display: none;
            }
            .feed-additional-info-container {
                .additional-info-title {
                    font-size: 16px;
                    font-weight: 400;
                    padding-bottom: 3px;
                    margin-top: 1px;
                    margin-bottom: 8px;
                    border-bottom: 1px solid #ddd;
                }
            }
        }
        #feed-content {
            margin-left: 400px;
            @media screen and (max-width: $sm) {
                margin-left: 0;
                margin-right: 0;
            }
        }
    }
</style>
