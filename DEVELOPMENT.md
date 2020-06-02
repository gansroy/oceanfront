# Development Guide

## Current status

This project is pre-alpha.

## Vue 3

Currently in beta, Vue 3 is available at https://github.com/vuejs/vue-next

The Vue supporting libraries are generally at earlier stages. There is also a good introduction to the changes here: https://vuejsdevelopers.com/2020/03/16/vue-js-tutorial/

It is important to review the RFCs at https://github.com/vuejs/rfcs in order to get properly familiar with the changes from Vue 2.

VSCode is my recommended IDE with Prettier as the code formatter. The Vetur plugin may cause issues.

## Overview

There are two packages in the 'monorepo':

- `oceanfront` is the library itself
- `demo` is a platform for testing and demonstrating the library

For now, this project uses Webpack to package and demo the library. In future it will likely move to Vite or Rollup for packaging the library once the tool support has improved.

Components are a mixture of single-file components (SFCs) and ones written purely in Typescript, the latter is preferred for the `oceanfront` package but SFCs are useful for rapid development and testing.

When integrating with 1CRM a separate library will be created, including `oceanfront` as a dependency and extending it with additional CRM-specific components and configuration.

## Runtime Configuration

One goal of this library is to easily inject configuration changes within a particular scope. This is achieved using `inject/provide` and various `ConfigManager` (lib/config.ts) classes for particular configuration topics. Each configuration manager defines a function to inject a reactive instance of the manager (f.ex. `useLocale`), which must be called during the `setup` of a dependent component. `OfConfig` demonstrates a component which exists solely to adjust the configuration for its nested components.

Settings are adjusted by calling `extendConfig` to provide a new configuration scope, or by adjusting the default configuration with `extendDefaultConfig`. All settings are reactive, and components will be automatically updated when any associated tracked refs are updated. Configuration managers can safely fetch data from other managers inside of an `extendConfig` callback, allowing settings to have dependencies.

## Field Types

This library defines a `FieldType` interface conceptually similar to the Component design in Vue 3. Instead of producing a single set of VNodes as a Component does, the FieldType's `setup` method produces an interface with various optional, reactive properties:

```typescript
export interface FieldRender {
  append?: () => Renderable | undefined
  blank?: boolean
  class?: string | string[]
  click?: (evt?: MouseEvent) => boolean | void
  content?: () => Renderable | undefined
  cursor?: string
  focus?: () => void
  focused?: boolean
  hovered?: boolean
  inputId?: string
  inputValue?: any
  loading?: boolean
  pendingValue?: any
  popup?: FieldPopup | undefined
  prepend?: () => Renderable | undefined
  updated?: boolean
  value?: any
}
```

These properties are used by `OfField` and other components to display the FieldType in a particular context. There are several slots (functions producing Renderable, a string or VNode) which can be arranged, or ignored, according to the container element. Other properties may affect the rendering of the container element, for example highlighting if a required value is currently blank.

Not yet implemented are the field type modes: fields will be able to dynamically switch between editing, viewing, and locked (editable-readonly) display modes based on the context.

Field types are registered with the `FormatManager` and can be resolved automatically (and overridden) within a configuration scope. This will allow for flexible, metadata-driven form generation.
