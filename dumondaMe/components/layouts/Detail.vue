<template>
    <div id="detail-layout">
        <div id="detail-sidebar">
            <slot name="sidebar"></slot>
        </div>
        <div id="detail-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<style lang="scss">
    #detail-layout {
        #detail-content {
            margin-right: 400px;
            @media screen and (min-width: $xs) and (max-width: $sm) {
                margin-right: 300px;
            }
            @media screen and (max-width: $xs) {
                margin-left: 0;
                margin-right: 0;
            }
        }
        #detail-sidebar {
            float: right;
            width: 360px;
            @media screen and (min-width: $xs) and (max-width: $sm) {
                width: 280px;
            }
            @media screen and (max-width: $xs) {
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

            .sidebar-container {
                margin-bottom: 32px;
                h3 {
                    font-size: 16px;
                    border-bottom: 1px solid #ddd;
                    margin-bottom: 12px;
                }
            }
        }
    }
</style>
