<template>
  <of-config :form="{ locked: true }">
    <header class="app-header">
      <div class="app-menu-source" @click.prevent="toggleSidebar">
        <div class="input-icon icon-menu"></div>
      </div>
      <div class="app-header-main">
        <div class="app-title">Oceanfront</div>
        <div class="app-tag">dev</div>
      </div>
      <div class="app-config-source" @click.prevent="showConfig">
        <div class="input-icon icon-gear"></div>
        <of-dialog v-model="configActive">
          <div class="container">
            <h4>Theme Config</h4>
            <label for="baseFontSize"
              >Base font size ({{ baseFontSize }}px)</label
            >
            <input
              id="baseFontSize"
              type="range"
              min="10"
              max="30"
              step="2"
              :value="baseFontSize"
              @change="updateFont"
            />
          </div>
        </of-dialog>
      </div>
    </header>
    <div class="app-body">
      <of-sidebar v-model="sidebarActive" :embed="true">
        <of-nav-group>
          <of-list-item to="/">Overview</of-list-item>
          <of-list-item disabled>Buttons</of-list-item>
          <of-list-item to="/icons">Icons</of-list-item>
          <of-list-item disabled>Lists</of-list-item>
          <of-list-item disabled>Dialogs</of-list-item>
          <of-list-item disabled>Menus</of-list-item>
          <of-list-item disabled>Forms</of-list-item>
          <of-list-item to="/select-inputs">Select Inputs</of-list-item>
          <of-list-item to="/text-inputs">Text Inputs</of-list-item>
          <of-list-item to="/toggle-inputs">Toggle Inputs</of-list-item>
          <of-list-item disabled>Picker Inputs</of-list-item>
          <of-list-item disabled>Formatters</of-list-item>
        </of-nav-group>
      </of-sidebar>
      <main class="app-main">
        <Suspense>
          <template #default>
            <router-view></router-view>
          </template>
          <template #fallback>
            Loading...
          </template>
        </Suspense>
      </main>
    </div>
  </of-config>
</template>

<script lang="ts">
import { onErrorCaptured, ref, defineComponent, SetupContext } from 'vue'
import TestForm from './components/TestForm.vue'
import TestInputs from './components/TestInputs.vue'

function formatError(e: Error) {
  return (e.stack || e).toString()
}

export default defineComponent({
  name: 'App',
  components: { TestForm, TestInputs },
  setup(props: {}, ctx: SetupContext) {
    const error = ref<any>(null)
    onErrorCaptured(e => {
      error.value = formatError(e)
      return true
    })
    const baseFontSize = ref('16')
    const configActive = ref(false)
    const sidebarActive = ref(true)
    const updateFont = function(evt: Event) {
      const size = (evt.target as HTMLInputElement).value
      baseFontSize.value = size
      document.documentElement.style.fontSize = size + 'px'
    }
    const showConfig = () => {
      configActive.value = true
    }
    const toggleSidebar = () => {
      sidebarActive.value = !sidebarActive.value
    }
    return {
      baseFontSize,
      configActive,
      error,
      showConfig,
      sidebarActive,
      toggleSidebar,
      updateFont
    }
  }
})
</script>

<style lang="scss" scoped>
.error-message {
  white-space: pre-wrap;
}
.app-header {
  align-items: center;
  background: linear-gradient(to bottom, #88aed3, #88bbd3);
  color: #fbfdff;
  display: flex;
  flex: none;
  height: 3rem;
}
.app-header-main {
  align-items: center;
  display: flex;
  flex: auto;
}
.app-menu-source,
.app-config-source {
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 1.75rem;
  width: 3rem;
  &:hover {
    color: #fff;
    text-shadow: 0 1.5px 2px rgba(36, 40, 60, 0.4);
  }
}
.app-body {
  display: flex;
  flex: auto;
  flex-flow: row nowrap;
  overflow: hidden;
}
.app-main {
  flex: auto;
  overflow: auto;
}
.app-title {
  font-size: 1.4rem;
  padding-left: 1em;
}
.app-tag {
  border: 1px solid #fff;
  border-radius: 2px;
  font-size: 0.9rem;
  margin-left: 1.5ch;
  padding: 0 0.5ch;
  text-transform: uppercase;
}
</style>
