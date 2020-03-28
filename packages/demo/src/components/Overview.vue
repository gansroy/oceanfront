<template>
  <div class="container">
    <h1>Oceanfront UI Library</h1>
    <div class="row">
      <h3>Why a new library?</h3>
      <ul>
        <li>
          Theming is designed around CSS variables and calculations, which
          limits support to newer browsers (Edge 15 in particular) but allows
          for dynamic customization of various theme parameters.
        </li>
        <li>
          Configuration settings are scoped using a provider, not (only)
          configured globally, in order to allow for local overrides including
          theme parameters. This also allows for applications with multiple
          independent root elements instead of a single application container.
        </li>
        <li>
          Input controls can support multiple variants, not limited to Material
          Design or a similar methodology. This allows us to update existing
          themes in the 1CRM application without completely changing the
          familiar interface for users.
        </li>
        <li>
          The approach to field formatting and validation is more centralized
          and consistent, requiring specific support by the input controls which
          would otherwise mean maintaining significant modifications to another
          library.
        </li>
        <li>
          The library does not include general page layout or CSS reset rules,
          allowing it to be mixed in with other frameworks and keeping the size
          to a minimum.
        </li>
        <li>
          For future-proofing, we would like to build on Vue 3, which is
          currently in the alpha phase. Existing Vue libraries will probably not
          be updated for some time.
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>
