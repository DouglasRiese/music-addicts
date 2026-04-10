<script setup></script>

<template>
    <div
        class="px-6 pt-4 md:px-6 lg:px-20 bg-[linear-gradient(-225deg,var(--p-sky-500),var(--p-sky-700)_48%,var(--p-sky-800))] dark:bg-[linear-gradient(-225deg,var(--p-sky-400),var(--p-sky-600)_48%,var(--p-sky-800))]"
    >
        <slot>
            <!--      Code between the <Background> </Background> tags is inserted here-->
        </slot>
    </div>
</template>

<style scoped>
div {
    height: auto;
    min-height: 95vh;
    display: flex;
    justify-content: center;
}
</style>
