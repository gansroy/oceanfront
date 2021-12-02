<template>
  <div class="container">
    <h1>Icons</h1>
    <p>
      The library will support a customizable mapping from standard named icons
      to theme-specific versions, with support for Material icons by default, along
      with any others that applications choose to include.
    </p>

    <of-config :icon-font="iconFont">
      <div class="row demo-row">
        <div class="demo-inline" v-for="(iconset, idx) of icons" :key="idx">
          <div class="demo-icon" v-for="(desc, icon) of iconset" :key="icon">
            <of-icon :name="icon" :title="desc" size="input" />
          </div>
        </div>
      </div>
    </of-config>

    <!-- div class="row">
      <div class="column">
        <of-select-field
          label="Select icon set"
          :items="fontOpts"
          v-model="iconFont"
        />
      </div>
    </div -->

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
          accept: 'accept',
          cancel: 'cancel',
          gear: 'gear',
          print: 'print',
          refresh: 'refresh',
          menu: 'menu',
          more: 'more',
          'more alt': 'more alt',
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
          checkbox: 'checkbox off',
          'checkbox checked': 'checkbox on',
          radio: 'radio off',
          'radio checked': 'radio on',
          star: 'star off',
          'star checked': 'star on',
        },
        {
          'arrow up': 'up arrow',
          'arrow down': 'down arrow',
          'arrow left': 'left arrow',
          'arrow right': 'right arrow',
        },
        {
          'page first': 'page first',
          'page previous': 'page previous',
          'page next': 'page next',
          'page last': 'page last',
        },
        {
          'bullet up': 'bullet up',
          'bullet down': 'bullet down',
          'bullet left': 'bullet left',
          'bullet right': 'bullet right',
        },
        {
          'expand up': 'expand up',
          'expand down': 'expand down',
          'expand open': 'expand',
          'expand close': 'expand close',
        },
        {
          // ellipsis circle
          // attach circle
          'accept circle': 'accept circle',
          'cancel circle': 'cancel circle',
          'info circle': 'info circle',
          'error circle': 'error circle',
          'plus circle': 'plus circle',
          'minus circle': 'minus circle',
          'help circle': 'help circle',
          // split circle
          // refresh circle
        },
        {
          'led grey': 'grey led',
          'led green': 'green led',
          'led red': 'red led',
          'led yellow': 'yellow led',
          'led violet': 'violet led',
          'led blue': 'blue led',
          'led orange': 'orange led',
        },
      ],
    }
  },
})
</script>

<style lang="scss">
.demo-inline {
  display: flex;
  flex-flow: row wrap;
}
.demo-icon {
  // box-sizing: content-box;
  // display: inline-block;
  border-radius: 2px;
  // font-size: 1.75rem;
  // line-height: 1;
  border: 1px solid #eee;
  background: #fffefd;
  color: #444;
  box-shadow: 0 1px 0 #ccc;
  cursor: default;
  margin: 2px;
  text-align: center;
  &:hover {
    color: #111;
  }
}
</style>
