<template>
    <div class="badge" :class="stateClass"><slot></slot></div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

type Status = 
    "success" | "final" | "info" | "draft"
    | "pending" | "deferred" | "special"
    | "error" | "alert" | "warning" 
    | "danger" | "closed" | "dead" | "invert" ;


export default defineComponent({
    props: {
        status: String as PropType<Status>,
    },
    setup(props) {
        const stateClass = computed( () => "state-" + props.status);
        return {
            stateClass
        }
    },
})
</script>


<style>
.badge {
    display: inline-block; 
    padding-left: 1ex;
    padding-right: 1ex;
    border: solid 1px;
    border-color: var(--border-color-badge); 
    color: var(--color-badge);
    background: var(--bg-badge);
    border-radius: 14px;
    height: 28px;
    margin-left: 0.25ex;
    margin-right: 0.25ex;
}

</style>