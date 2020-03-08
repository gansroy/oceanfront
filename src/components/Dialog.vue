<template>
  <overlay :active="active" @blur="hide">
    <template v-slot="{ active }">
      <transition name="slide-down">
        <div
          role="dialog"
          :id="id"
          class="dialog"
          :class="classAttr"
          v-if="active"
        >
          <slot name="title"></slot>
          <slot></slot>
        </div>
      </transition>
    </template>
  </overlay>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  SetupContext,
  reactive,
  computed,
  Ref,
  watch
} from 'vue'
import Overlay from './Overlay.vue'

export default defineComponent({
  name: 'dialog',
  components: { Overlay },
  inheritAttrs: false,
  props: {
    class: String,
    id: String,
    loading: { default: false },
    modelValue: Boolean
  },
  setup(props, ctx: SetupContext) {
    const active = ref(props.modelValue)
    watch(
      () => props.modelValue,
      val => {
        active.value = props.modelValue
      }
    )
    const loading = computed(() => props.loading)
    const classAttr = computed(() => props.class)
    const hide = () => {
      active.value = false
      ctx.emit('update:modelValue', false)
    }
    const show = () => (active.value = true)
    return {
      active,
      id: computed(() => props.id),
      classAttr,
      hide,
      loading,
      show
    }
  }
})
</script>
