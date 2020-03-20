<template>
  <of-field-outer v-bind="fieldAttrs" @click="open">
    <div ref="elt" v-bind="attrs" v-on="handlers">
      <slot>{{ value }}</slot>
    </div>
    <span
      :class="
        'of-select-arrow input-bullet ' + (opened ? 'bullet-up' : 'bullet-down')
      "
    ></span>
  </of-field-outer>
  <of-overlay
    :active="opened"
    :capture="false"
    :shade="false"
    :target="'#' + fieldAttrs.id"
    @blur="closePopup"
  >
    <template v-slot="{ state }">
      <transition name="slide-down">
        <div role="menu" class="of-dialog of-menu-outer" v-if="state">
          <slot>
            <of-nav-group>
              <template v-slot="{ focused }">
                <of-menu-item>Hello there</of-menu-item>
                <of-menu-item>Yes you</of-menu-item>
              </template>
            </of-nav-group>
          </slot>
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
import { FieldConfig } from '../lib/field'
import OfFieldOuter from './FieldOuter.vue'
import OfMenuItem from './MenuItem.vue'
import OfNavGroup from './NavGroup.vue'
import OfOverlay from './Overlay.vue'

export default defineComponent({
  name: 'of-select',
  components: { OfFieldOuter, OfMenuItem, OfNavGroup, OfOverlay },
  props: {
    class: String, // or object or list
    config: Object,
    disabled: Boolean,
    id: String,
    label: String,
    maxlength: Number,
    modelValue: String,
    placeholder: String,
    readonly: Boolean,
    value: String,
    variant: String
  },
  setup(props, ctx: SetupContext) {
    const config = props.config || {}
    const inputValue = ref(
      props.value === undefined ? props.modelValue : props.value
    )
    watch(
      () => props.modelValue,
      val => {
        inputValue.value = val
      }
    )
    const disabled = computed(() => config.disabled || props.disabled)
    const elt = ref<HTMLElement | undefined>()
    const focused = ref(false)
    const opened = ref(false)
    const readonly = computed(
      () => (config.readonly || props.readonly) && !disabled.value
    )
    const id =
      props.id || config.id || 'input-' + Math.round(Math.random() * 1000) // FIXME
    const focus = () => {
      elt.value?.focus()
    }
    const open = (evt?: Event) => {
      if (evt) evt.preventDefault()
      if (!disabled.value) opened.value = true
      ctx.emit('open')
    }
    const handlers = {
      blur(evt: FocusEvent) {
        focused.value = false
        ctx.emit('blur')
      },
      click(evt: MouseEvent) {
        open(evt)
      },
      focus(evt: FocusEvent) {
        focused.value = true
        ctx.emit('focus')
      },
      keydown(evt: KeyboardEvent) {
        ctx.emit('keydown', evt)
      }
    }
    const closePopup = () => {
      opened.value = false
    }
    const blank = computed(() => {
      // FIXME ask formatter
      const val = inputValue.value
      return val === undefined || val === null || val === ''
    })
    const fieldAttrs = computed(() => ({
      blank: blank.value,
      class: ['of-field-select', props.class],
      config,
      disabled: disabled.value,
      focused: focused.value || opened.value,
      id: id + '-outer',
      inputId: id,
      label: props.label === undefined ? config.label : props.label,
      opened: opened.value,
      readonly: readonly.value,
      variant: props.variant
    }))
    return {
      attrs: computed(() => ({
        id,
        class: 'of-field-input',
        tabindex: 0
      })),
      closePopup,
      elt,
      fieldAttrs,
      focus,
      handlers,
      open,
      opened,
      value: inputValue.value
    }
  }
})
</script>

<style scoped></style>
