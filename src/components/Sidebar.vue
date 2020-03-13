<template>
  <overlay :active="active" align="left" :pad="false" @blur="hide">
    <template v-slot="{ active }">
      <transition name="slide-right">
        <div
          role="navigation"
          :id="id"
          class="sidebar"
          :class="classAttr"
          v-if="active"
        >
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
  name: 'sidebar',
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
