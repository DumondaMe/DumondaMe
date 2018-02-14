<template>
    <div id="detail-layout">
        <div id="detail-content">
            <slot name="content"></slot>
        </div>
        <div id="detail-sidebar">
            <slot name="sidebar"></slot>
        </div>
    </div>
</template>

<style lang="scss">
    #detail-layout {
        #detail-content {
            float: left;
            width: 620px;
            @media screen and (max-width: $sm) {
                width: 100%;
                margin-left: 0;
                margin-right: 0;
            }
        }
        #detail-sidebar {
            margin-left: 700px;
            @media screen and (max-width: $sm) {
                display: none;
            }
            .detail-container {
                .detail-title {
                    font-size: 18px;
                    font-weight: 500;
                    padding-left: 5px;
                    padding-bottom: 3px;
                    margin-bottom: 8px;
                    border-bottom: 1px solid #ddd;
                }
            }
        }
    }
</style>
