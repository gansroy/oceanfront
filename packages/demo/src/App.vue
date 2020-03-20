<template>
  <header class="app-header">
    <div class="app-menu-source" @click="toggleSidebar">
      <div class="input-icon icon-menu"></div>
    </div>
    <div class="app-title">Oceanfront</div>
    <div class="app-tag">dev</div>
  </header>
  <div class="app-body">
    <of-sidebar v-model="sidebarActive" :embed="true">
      <of-nav-group>
        <of-menu-item to="/">Test form</of-menu-item>
        <of-menu-item to="/inputs">Test inputs</of-menu-item>
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
    const sidebarActive = ref(true)
    const toggleSidebar = () => {
      sidebarActive.value = !sidebarActive.value
    }
    return { error, sidebarActive, toggleSidebar }
  }
})
</script>

<style scoped>
.error-message {
  white-space: pre-wrap;
}
.app-header {
  align-items: center;
  background: linear-gradient(to bottom, #88aed3, #88bbd3);
  color: #fff;
  display: flex;
  flex: none;
  height: 48px;
}
.app-menu-source {
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 28px;
  width: 48px;
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
  font-size: 20px;
  padding-left: 1em;
}
.app-tag {
  border: 1px solid #fff;
  border-radius: 2px;
  font-size: 14px;
  margin-left: 1.5ch;
  padding: 0 0.5ch;
  text-transform: uppercase;
}
</style>
