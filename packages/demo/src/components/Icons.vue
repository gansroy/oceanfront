<template>
  <div class="container">
    <h1>Icons</h1>
    <p>
      The library will support a customizable mapping from standard named icons
      to theme-specific versions, with support for Material icons as well as the
      current UIBasic icon set, and any others that applications add support
      for.
    </p>

    <of-config :icon-font="iconFont">
      <div class="row demo-row">
        <div class="demo-inline" v-for="(iconset, idx) of icons" :key="idx">
          <div class="demo-icon" v-for="(desc, icon) of iconset" :key="icon">
            <of-icon :name="icon" :title="desc" />
          </div>
        </div>
        <div class="demo-inline">
          <div class="demo-icon">
            <of-icon name="led-grey" title="grey led" />
          </div>
          <div class="demo-icon">
            <of-icon name="led-green" title="green led" />
          </div>
          <div class="demo-icon">
            <of-icon name="led-red" title="red led" />
          </div>
          <div class="demo-icon">
            <of-icon name="led-yellow" title="yellow led" />
          </div>
          <div class="demo-icon">
            <of-icon name="led-violet" title="violet led" />
          </div>
          <div class="demo-icon">
            <of-icon name="led-blue" title="blue led" />
          </div>
          <div class="demo-icon">
            <of-icon name="led-orange" title="orange led" />
          </div>
        </div>
      </div>
    </of-config>

    <div class="row">
      <div class="column">
        <h4>Select Icon Set</h4>
        <of-select-field :items="fontOpts" v-model:value="iconFont" />
      </div>
    </div>

    <h2>Two-color SVG icons</h2>
    <of-icon-preview />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import OfIconPreview from './iconedit/Preview.vue'

export default defineComponent({
  components: { OfIconPreview },
  setup(_props, _ctx) {
    const iconFont = ref('')
    const fontOpts = [
      { value: '', text: 'Default' },
      { value: 'uii', text: 'UIBasic' },
      { value: 'mi', text: 'Material' },
    ]
    return {
      iconFont,
      fontOpts,
      icons: [
        {
          'expand-up': 'expand up',
          'expand-down': 'expand down',
          expand: 'expand',
          'expand-close': 'expand close',
          menu: 'menu',
          'alt-menu': 'alt menu',
          ellipsis: 'ellipsis',
          accept: 'accept',
          cancel: 'cancel',
          gear: 'gear',
          print: 'print',
          refresh: 'refresh',
        },
        {
          required: 'required',
          email: 'email',
          mobile: 'mobile',
          phone: 'phone',
          external: 'external',
          attach: 'attachment',
          plus: 'plus',
          user: 'user',
          lock: 'lock',
          search: 'search',
          date: 'date',
          time: 'time',
          hourglass: 'hourglass',
        },
        {
          checkbox: 'check off',
          'checkbox checked': 'check on',
          radio: 'radio off',
          'radio checked': 'radio on',
          star: 'star off',
          'star checked': 'star on',
        },
        {
          'arrow-up': 'up arrow',
          'arrow-down': 'down arrow',
          'arrow-left': 'left arrow',
          'arrow-right': 'right arrow',
          'nav-first': 'nav first',
          'nav-previous': 'nav previous',
          'nav-next': 'nav next',
          'nav-last': 'nav last',
          'triangle-up': 'triangle up',
          'triangle-down': 'triangle down',
          previous: 'previous',
          next: 'next',
        },
        {
          'circle-ellipsis': 'circle ellipsis',
          'circle-attach': 'circle attachment',
          'circle-check': 'circle check',
          'circle-cross': 'circle cross',
          'circle-info': 'circle info',
          'circle-error': 'circle error',
          'circle-plus': 'circle plus',
          'circle-minus': 'circle minus',
          'circle-help': 'circle help',
          // circle-split
          // circle-refresh
        },
      ],
    }
  },
})
</script>

<style lang="scss">
.demo-icon {
  box-sizing: content-box;
  display: inline-block;
  border-radius: 2px;
  font-size: 1.75rem;
  line-height: 1;
  border: 1px solid #eee;
  background: #fffefd;
  color: #444;
  box-shadow: 0 1px 0 #ccc;
  cursor: default;
  text-align: center;
  &:hover {
    color: #111;
  }
}
</style>
