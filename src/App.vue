<template>
  <div v-if="error" class="errorMessage">
    {{ error }}
  </div>
  <Suspense v-else>
    <template #default>
      <test-form />
      <div class="theme-base">
        <test-inputs />
      </div>
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script lang="ts">
import { onErrorCaptured, ref, defineComponent, SetupContext } from 'vue'
import TestForm from './demo/TestForm.vue'
import TestInputs from './demo/TestInputs.vue'

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
    return { error }
  }
})
</script>

<style scoped>
.errorMessage {
  white-space: pre-wrap;
}
</style>
