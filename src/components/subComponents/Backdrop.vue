<script setup></script>

<template>
    <div
        class="p-12 shadow text-center backdrop-blur-md rounded-xl bg-[rgba(255,255,255,0.1)]"
    >
        <slot>
            <!--      Code between the <Backdrop> </Backdrop> tags is inserted here-->
        </slot>
    </div>
</template>

<style scoped>
div {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
}
</style>
