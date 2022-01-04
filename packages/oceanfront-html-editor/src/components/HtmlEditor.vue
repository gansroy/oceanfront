<template>
  <div :class="['of-field', 'editor', !isEditable ? 'fixed' : 'active']">
    <div v-if="editor && isEditable" class="editor-toolbar">
      <of-button
        @click="editor.chain().focus().toggleBold().run()"
        density="3"
        :variant="getVariant('bold')"
        icon="format bold"
        title="Bold"
      />
      <of-button
        @click="editor.chain().focus().toggleItalic().run()"
        density="3"
        :variant="getVariant('italic')"
        icon="format italic"
        title="Italic"
      />
      <of-button
        @click="editor.chain().focus().toggleStrike().run()"
        density="3"
        :variant="getVariant('strike')"
        icon="format strikethrough"
        title="Strike"
      />
      <of-button
        @click="editor.chain().focus().toggleCode().run()"
        density="3"
        :variant="getVariant('code')"
        icon="code"
        title="Code"
      />
      <of-button
        @click="editor.chain().focus().setParagraph().run()"
        density="3"
        :variant="getVariant('paragraph')"
        icon="paragraph"
        title="Paragraph"
      />
      <div class="divider"></div>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        density="3"
        :variant="getVariant('heading', { level: 1 })"
        icon="h-1"
        titile="Heading 1"
      />
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        density="3"
        :variant="getVariant('heading', { level: 2 })"
        icon="h-2"
        titile="Heading 2"
      />
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        density="3"
        :variant="getVariant('heading', { level: 3 })"
        icon="h-3"
        titile="Heading 3"
      />
      <of-button
        @click="editor.chain().focus().toggleBulletList().run()"
        density="3"
        :variant="getVariant('bulletList')"
        icon="format list-bulleted"
        title="Bullet List"
      />
      <of-button
        @click="editor.chain().focus().toggleOrderedList().run()"
        density="3"
        :variant="getVariant('orderedList')"
        icon="format list-numbered"
        title="Ordered List"
      />
      <of-button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        density="3"
        :variant="getVariant('codeBlock')"
        icon="developer-mode"
        title="Code Block"
      />
      <div class="divider"></div>
      <of-button
        @click="editor.chain().focus().setTextAlign('left').run()"
        density="3"
        :variant="getVariant({ textAlign: 'left' })"
        icon="format align-left"
        title="Left"
      />
      <of-button
        @click="editor.chain().focus().setTextAlign('center').run()"
        density="3"
        :variant="getVariant({ textAlign: 'center' })"
        icon="format align-center"
        title="Center"
      />
      <of-button
        @click="editor.chain().focus().setTextAlign('right').run()"
        density="3"
        :variant="getVariant({ textAlign: 'right' })"
        icon="format align-right"
        title="Right"
      />
      <of-button
        @click="editor.chain().focus().setTextAlign('justify').run()"
        density="3"
        :variant="getVariant({ textAlign: 'justify' })"
        icon="format align-justify"
        title="Justify"
      />
      <div class="divider"></div>
      <of-button
        @click="editor.chain().focus().toggleBlockquote().run()"
        density="3"
        :variant="getVariant('blockquote')"
        icon="format quote"
        title="Blockquote"
      />
      <of-button
        @click="editor.chain().focus().setHorizontalRule().run()"
        density="3"
        variant="text"
        icon="separator"
        title="Horizontal Rule"
      />
      <div class="divider"></div>
      <of-button
        @click="editor.chain().focus().setHardBreak().run()"
        density="3"
        variant="text"
        icon="wrap-text"
        title="Hard Break"
      />
      <of-button
        @click="editor.chain().focus().clearNodes().run()"
        density="3"
        variant="text"
        icon="format clear"
        title="Clear Format"
      />
      <div class="divider"></div>
      <of-button
        @click="addImage"
        density="3"
        variant="text"
        icon="insert-photo"
        title="Image"
      />
      <of-button
        @click="addLink"
        density="3"
        variant="text"
        icon="insert-link"
        title="Link"
      />
      <div class="divider"></div>
      <of-button
        @click="editor.chain().focus().undo().run()"
        density="3"
        variant="text"
        icon="undo"
        title="Undo"
      />
      <of-button
        @click="editor.chain().focus().redo().run()"
        density="3"
        variant="text"
        icon="redo"
        title="Redo"
      />
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  PropType,
  computed,
  ComputedRef,
  SetupContext,
} from 'vue'
import { useEditor, EditorContent, Extension } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { FormRecord } from 'oceanfront'

export default defineComponent({
  name: 'OfHtmlEditor',
  components: {
    EditorContent,
  },
  props: {
    name: String,
    modelValue: {
      type: String,
      default: '',
    },
    record: {
      type: Object as PropType<FormRecord>,
      required: false,
    },
    extensions: {
      type: Array as PropType<Extension[]>,
    },
    editable: {
      type: Boolean,
      default: true,
    },
  },
  emits: {
    'update:modelValue': null,
    updated: null,
  },
  setup(props, ctx: SetupContext) {
    const isEditable: ComputedRef<boolean> = computed(() => props.editable)

    const record: ComputedRef<FormRecord | undefined> = computed(() => {
      return props.record || undefined
    })

    const htmlFieldName: ComputedRef<string | undefined> = computed(() => {
      return props.name ? `${props.name}_html` : undefined
    })

    const fieldValue: ComputedRef<string> = computed(() => {
      let value = props.modelValue ?? ''

      if (record.value && props.name && htmlFieldName.value) {
        const htmlValue = record.value.value[htmlFieldName.value] ?? null
        const textValue = record.value.value[props.name] ?? null
        if (htmlValue) {
          value = htmlValue
        } else if (textValue) {
          value = textValue
        }
      }

      return value
    })

    watch(
      () => props.modelValue,
      (value) => {
        if (!record.value) {
          const isSame = editor.value.getHTML() === value
          if (isSame) return
          editor.value.commands.setContent(value, false)
        }
      }
    )

    watch(
      () => record.value?.value[htmlFieldName.value as string],
      (value) => {
        const isSame = editor.value.getHTML() === value
        if (isSame) return
        editor.value.commands.setContent(value, false)
      }
    )

    watch(
      () => isEditable.value,
      (value) => {
        editor.value.setEditable(value)
      }
    )

    const coreExtensions = [
      StarterKit,
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link,
    ]

    const editor = useEditor({
      content: fieldValue.value,
      editable: isEditable.value,
      extensions: props.extensions
        ? coreExtensions.concat(props.extensions)
        : coreExtensions,
      onUpdate: () => {
        if (props.name && htmlFieldName.value && record.value) {
          record.value.value[htmlFieldName.value] = editor.value.getHTML()
          record.value.value[props.name] = editor.value.getText()
        } else {
          ctx.emit('update:modelValue', editor.value.getHTML())
        }

        ctx.emit('updated', {
          html: editor.value.getHTML(),
          text: editor.value.getText(),
        })
      },
    })

    const getVariant = (name: any, params = {}): string => {
      return editor.value.isActive(name, params) ? 'filled' : 'text'
    }

    const addImage = () => {
      const url = window.prompt('URL')

      if (url) {
        editor.value.chain().focus().setImage({ src: url }).run()
      }
    }

    const addLink = () => {
      const url = window.prompt('Link')

      if (url) {
        editor.value.chain().focus().setLink({ href: url }).run()
      }
    }

    return { editor, getVariant, addImage, addLink, isEditable }
  },
})
</script>
