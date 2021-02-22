<template>
  <of-overlay
    :active="active"
    align="left"
    :pad="false"
    :embed="embed"
    @blur="hide"
  >
    <template #default="{ active, state }">
      <transition :name="state === 'overlay' ? 'slide-right' : null">
        <nav
          class="of-sidebar"
          :class="classAttr"
          :id="id"
          role="navigation"
          v-if="active"
        >
          <slot></slot>
        </nav>
      </transition>
    </template>
  </of-overlay>
</template>

<script lang="ts">
import { ref, defineComponent, SetupContext, computed, watch } from 'vue'
import { OfOverlay } from './Overlay'

export default defineComponent({
  name: 'OfSidebar',
  components: { OfOverlay },
  inheritAttrs: false,
  props: {
    class: String,
    embed: Boolean,
    id: String,
    loading: Boolean,
    modelValue: Boolean,
  },
  emits: ['update:modelValue'],
  setup(props, ctx: SetupContext) {
    const active = ref(props.modelValue)
    watch(
      () => props.modelValue,
      (val) => {
        active.value = val
      }
    )
    const embed = computed(() => props.embed)
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
      embed,
      hide,
      loading,
      show,
    }
  },
})
</script>
