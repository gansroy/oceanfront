<template>
  <of-overlay :active="active" @blur="hide">
    <template v-slot="{ state }">
      <transition name="slide-down">
        <div
          role="dialog"
          :id="id"
          class="of-dialog"
          :class="classAttr"
          v-if="state"
        >
          <slot name="title"></slot>
          <slot></slot>
        </div>
      </transition>
    </template>
  </of-overlay>
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
import OfOverlay from './Overlay.vue'

export default defineComponent({
  name: 'of-dialog',
  components: { OfOverlay },
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
