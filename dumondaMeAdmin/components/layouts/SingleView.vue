<template>
    <div id="detail-layout">
        <div id="detail-content">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<style lang="scss">
    #detail-layout {
        #detail-content {
            max-width: 1000px;
        }
    }
</style>
