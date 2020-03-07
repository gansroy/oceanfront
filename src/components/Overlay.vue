<template>
  <transition appear>
    <div
      :id="id"
      class="overlay-outer"
      :class="classAttr"
      role="document"
      ref="elt"
      v-show="active"
      @click.self.prevent="outerClick"
    >
      <slot name="loading" v-if="loading">
        <of-spinner />
      </slot>
      <slot :active="active"></slot>
    </div>
  </transition>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  SetupContext,
  reactive,
  computed,
  Ref,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  watch,
  nextTick
} from 'vue'
import OfSpinner from './Spinner.vue'

export default defineComponent({
  name: 'overlay',
  components: { OfSpinner },
  inheritAttrs: false,
  props: {
    active: { default: false },
    capture: { default: true },
    class: String,
    id: String,
    loading: { default: false },
    shade: { default: true }
  },
  setup(props, ctx: SetupContext) {
    const active = computed(() => props.active)
    const classAttr = computed(() => {
      const cls = {
        active: active.value,
        capture: active.value && props.capture,
        loading: props.loading,
        pad: true,
        shade: props.shade
      }
      return [cls, props.class]
    })
    const elt = ref<HTMLElement | undefined>()
    const outerClick = () => ctx.emit('click')
    onMounted(() => {
      if (!elt.value) return
      let parent = elt.value.parentNode as HTMLElement
      parent =
        (parent && parent.closest('[data-overlay-parent]')) ?? document.body
      parent.appendChild(elt.value)
    })
    return {
      active,
      elt,
      id: computed(() => props.id),
      classAttr,
      outerClick
    }
  }
})
</script>
