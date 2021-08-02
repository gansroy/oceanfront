<template>
    <div class="badge" :class="{[stateClass] : true, circular, icon}"><slot></slot></div>
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
        circular: Boolean,
        icon: Boolean,
    },
    setup(props) {
        const stateClass = computed( () => "state-" + props.status);
        const circular = computed( () => props.circular);
        const icon = computed( () => props.icon);
        return {
            stateClass,
            circular,
            icon,
        }
    },
})
</script>
