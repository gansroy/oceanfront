<template>
  <field-outer v-bind="fieldAttrs" @click="open">
    <div ref="elt" v-bind="attrs" v-on="handlers">
      <slot>{{ value }}</slot>
    </div>
  </field-outer>
  <overlay
    :active="opened"
    :capture="false"
    :shade="false"
    :target="'#' + fieldAttrs.id"
    @blur="closePopup"
  >
    <template v-slot="{ active }">
      <transition name="slide-down">
        <div role="menu" class="dialog menu-outer" v-if="active">
          <slot>
            <nav-group>
              <template v-slot="{ focused }">
                <menu-item>Hello there</menu-item>
                <menu-item>Yes you</menu-item>
              </template>
            </nav-group>
          </slot>
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
import { FieldConfig } from '../lib/field'
import FieldOuter from './FieldOuter.vue'
import MenuItem from './MenuItem.vue'
import NavGroup from './NavGroup.vue'
import Overlay from './Overlay.vue'

export default defineComponent({
  name: 'input-text',
  components: { FieldOuter, Overlay, NavGroup, MenuItem },
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
      class: ['field-select', props.class],
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
        class: 'field-input',
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
