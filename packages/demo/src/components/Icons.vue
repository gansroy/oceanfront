<template>
  <div class="container">
    <h1>Icons</h1>
    <p>
      The library will support a customizable mapping from standard named icons
      to theme-specific versions, with support for Material icons as well as the
      current UIBasic icon set, and any others that applications add support
      for.
    </p>

    <div class="row demo-row">
      <div class="demo-inline">
        <div
          class="demo-icon input-icon icon-expand-up"
          title="expand up"
        ></div>
        <div
          class="demo-icon input-icon icon-expand-down"
          title="expand down"
        ></div>
        <div class="demo-icon input-icon icon-expand" title="expand"></div>
        <div
          class="demo-icon input-icon icon-expand-close"
          title="expand close"
        ></div>
        <div class="demo-icon input-icon icon-menu" title="menu"></div>
        <div class="demo-icon input-icon icon-alt-menu" title="alt menu"></div>
        <div class="demo-icon input-icon icon-ellipsis" title="ellipsis"></div>
        <div class="demo-icon input-icon icon-accept" title="accept"></div>
        <div class="demo-icon input-icon icon-cancel" title="cancel"></div>
        <div class="demo-icon input-icon icon-gear" title="gear"></div>
        <div class="demo-icon input-icon icon-print" title="print"></div>
        <div class="demo-icon input-icon icon-refresh" title="refresh"></div>
      </div>
      <div class="demo-inline">
        <div class="demo-icon input-icon icon-required" title="required"></div>
        <div class="demo-icon input-icon icon-email" title="email"></div>
        <div class="demo-icon input-icon icon-mobile" title="mobile"></div>
        <div class="demo-icon input-icon icon-phone" title="phone"></div>
        <div class="demo-icon input-icon icon-external" title="external"></div>
        <div class="demo-icon input-icon icon-attach" title="attachment"></div>
        <div class="demo-icon input-icon icon-plus" title="plus"></div>
        <div class="demo-icon input-icon icon-user" title="user"></div>
        <div class="demo-icon input-icon icon-lock" title="lock"></div>
        <div class="demo-icon input-icon icon-search" title="search"></div>
        <div class="demo-icon input-icon icon-date" title="date"></div>
        <div class="demo-icon input-icon icon-time" title="time"></div>
        <div
          class="demo-icon input-icon icon-hourglass"
          title="hourglass"
        ></div>
        <div
          class="demo-icon input-icon icon-hamburger"
          title="hamburger"
        ></div>
      </div>
      <div class="demo-inline">
        <div class="demo-icon input-icon icon-checkbox" title="check off"></div>
        <div
          class="demo-icon input-icon icon-checkbox checked"
          title="check on"
        ></div>
        <div class="demo-icon input-icon icon-radio" title="radio off"></div>
        <div
          class="demo-icon input-icon icon-radio checked"
          title="radio on"
        ></div>
        <div class="demo-icon input-icon icon-star" title="star off"></div>
        <div
          class="demo-icon input-icon icon-star checked"
          title="star on"
        ></div>
      </div>
      <div class="demo-inline">
        <div class="demo-icon input-icon icon-arrow-up" title="up arrow"></div>
        <div
          class="demo-icon input-icon icon-arrow-down"
          title="down arrow"
        ></div>
        <div
          class="demo-icon input-icon icon-arrow-left"
          title="left arrow"
        ></div>
        <div
          class="demo-icon input-icon icon-arrow-right"
          title="right arrow"
        ></div>
        <div class="demo-icon input-icon icon-nav-first" title="first"></div>
        <div
          class="demo-icon input-icon icon-nav-previous"
          title="fprevious"
        ></div>
        <div class="demo-icon input-icon icon-nav-next" title="fnext"></div>
        <div class="demo-icon input-icon icon-nav-last" title="last"></div>
        <div class="demo-icon input-icon icon-previous" title="previous"></div>
        <div class="demo-icon input-icon icon-next" title="next"></div>
        <div
          class="demo-icon input-icon icon-triangle-up"
          title="triangle up"
        ></div>
        <div
          class="demo-icon input-icon icon-triangle-down"
          title="triangle down"
        ></div>
      </div>
      <div class="demo-inline">
        <div
          class="demo-icon input-icon icon-circle-ellipsis"
          title="circle ellipsis"
        ></div>
        <div
          class="demo-icon input-icon icon-circle-attach"
          title="circle attachment"
        ></div>
        <div
          class="demo-icon input-icon icon-circle-check"
          title="circle check"
        ></div>
        <div
          class="demo-icon input-icon icon-circle-cross"
          title="circle cross"
        ></div>
        <div
          class="demo-icon input-icon icon-circle-info"
          title="circle info"
        ></div>
        <div
          class="demo-icon input-icon icon-circle-error"
          title="circle error"
        ></div>
        <div
          class="demo-icon input-icon icon-circle-plus"
          title="circle plus"
        ></div>
        <div
          class="demo-icon input-icon icon-circle-minus"
          title="circle minus"
        ></div>
        <!-- div
        class="demo-icon input-icon icon-circle-split"
        title="circle split"
      ></div>
      <div
        class="demo-icon input-icon icon-circle-join"
        title="circle join"
      ></div>
      <div
        class="demo-icon input-icon icon-circle-refresh"
        title="circle refresh"
      ></div -->
      </div>
      <div class="demo-inline">
        <div
          class="demo-icon input-icon input-led led-grey"
          title="grey led"
        ></div>
        <div
          class="demo-icon input-icon input-led led-green"
          title="green led"
        ></div>
        <div
          class="demo-icon input-icon input-led led-red"
          title="red led"
        ></div>
        <div
          class="demo-icon input-icon input-led led-yellow"
          title="yellow led"
        ></div>
        <div
          class="demo-icon input-icon input-led led-violet"
          title="violet led"
        ></div>
        <div
          class="demo-icon input-icon input-led led-blue"
          title="blue led"
        ></div>
        <div
          class="demo-icon input-icon input-led led-orange"
          title="orange led"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup(props, ctx) {}
})
</script>

<style lang="scss" scoped>
.demo-icon {
  box-sizing: content-box;
  display: inline-block;
  border-radius: 2px;
  font-size: 28px;
  line-height: 28px;
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
