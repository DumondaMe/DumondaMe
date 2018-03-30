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
            width: 220px;
            @media screen and (max-width: $sm) {
                display: none;
            }
            .feeds-container {
                .feedTitle {
                    font-size: 18px;
                    font-weight: 500;
                    padding-left: 5px;
                    padding-bottom: 3px;
                    margin-bottom: 8px;
                    border-bottom: 1px solid #ddd;
                }
            }
        }
        #feed-content {
            margin-left: 340px;
            @media screen and (max-width: $sm) {
                margin-left: 0;
                margin-right: 0;
            }
        }
    }
</style>
