<template>
  <of-field-outer v-bind="fieldAttrs" @click="open">
    <div ref="elt" v-bind="attrs" v-on="handlers">
      <slot>{{ value }}</slot>
    </div>
    <of-icon
      :name="opened ? 'bullet-select-close' : 'bullet-select'"
      class="of-bullet-select"
    ></of-icon>
  </of-field-outer>
  <of-overlay
    :active="opened"
    :capture="false"
    :shade="false"
    :target="'#' + fieldAttrs.id"
    @blur="closePopup"
  >
    <template v-slot="{ active }">
      <transition name="slide-down">
        <div role="menu" class="of-menu" v-if="active">
          <slot>
            <of-nav-group>
              <template v-slot="{ focused }">
                <div v-if="!formatItems.length" style="padding: 0 0.5em">
                  No items
                </div>
                <div class="of-list-outer" v-else>
                  <template v-for="item of formatItems">
                    <div
                      class="of-list-header"
                      v-if="item.special === 'header'"
                      v-text="item.text"
                    />
                    <div
                      class="of-list-divider"
                      v-else-if="item.special === 'divider'"
                      v-text="item.text"
                    />
                    <of-list-item
                      :active="item.selected"
                      :disabled="item.disabled"
                      @click="setValue(item.value)"
                      v-else
                      >{{ item.text }}</of-list-item
                    >
                  </template>
                </div>
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
import OfFieldOuter from './FieldOuter.vue'
import OfListItem from './ListItem.vue'
import OfNavGroup from './NavGroup.vue'
import OfOverlay from './Overlay.vue'
import { useItems } from '../lib/items'

export default defineComponent({
  name: 'of-select',
  components: { OfFieldOuter, OfListItem, OfNavGroup, OfOverlay },
  props: {
    class: String, // or object or list
    disabled: Boolean,
    id: String,
    items: [String, Array, Object],
    label: String,
    maxlength: Number,
    modelValue: String,
    name: String,
    placeholder: String,
    readonly: Boolean,
    value: String,
    variant: String
  },
  setup(props, ctx: SetupContext) {
    const itemMgr = useItems()
    const inputValue = ref(
      props.value === undefined ? props.modelValue : props.value
    )
    watch(
      () => props.modelValue,
      val => {
        inputValue.value = val
      }
    )
    const disabled = computed(() => props.disabled)
    const elt = ref<HTMLElement | undefined>()
    const focused = ref(false)
    const opened = ref(false)
    const readonly = computed(() => props.readonly && !disabled.value)
    const id = props.id || 'input-' + Math.round(Math.random() * 1000) // FIXME
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
      disabled: disabled.value,
      focused: focused.value || opened.value,
      id: id + '-outer',
      inputId: id,
      label: props.label === undefined ? props.label : props.label,
      opened: opened.value,
      readonly: readonly.value,
      variant: props.variant
    }))
    const items = computed(
      () => itemMgr.getItemList(props.items) || { items: [] }
    )
    const formatItems = computed(() => {
      const resolved = items.value
      const value = inputValue.value
      const disabledKey =
        resolved.disabledKey === undefined ? 'disabled' : resolved.disabledKey
      const specialKey =
        resolved.specialKey === undefined ? 'special' : resolved.specialKey
      const textKey = resolved.textKey === undefined ? 'text' : resolved.textKey
      const valueKey =
        resolved.valueKey === undefined ? 'value' : resolved.valueKey
      const rows = []
      for (const item of resolved.items) {
        if (typeof item === 'string') {
          rows.push({
            disabled: false,
            text: item,
            selected: item === value,
            value: item
          })
        } else if (typeof item === 'object') {
          rows.push({
            disabled: item[disabledKey],
            text: item[textKey],
            value: item[valueKey],
            selected: item[valueKey] === value,
            special: item[specialKey]
          })
        }
      }
      return rows
    })
    const specialKey = computed(() => {
      const def = items.value.specialKey
      return def === undefined ? 'special' : def
    })
    const textKey = computed(() => {
      const def = items.value.textKey
      return def === undefined ? 'text' : def
    })
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
      formatItems,
      handlers,
      open,
      opened,
      setValue(val: any) {
        inputValue.value = val
        ctx.emit('update:modelValue', val)
        closePopup()
      },
      value: inputValue
    }
  }
})
</script>
