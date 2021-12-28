<template>
  <div class="of-field editor">
    <div v-if="editor" class="editor-toolbar">
      <of-button
        @click="editor.chain().focus().toggleBold().run()"
        density="3"
        :variant="getVariant('bold')"
      >
        bold
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleItalic().run()"
        density="3"
        :variant="getVariant('italic')"
      >
        italic
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleStrike().run()"
        density="3"
        :variant="getVariant('strike')"
      >
        strike
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleCode().run()"
        density="3"
        :variant="getVariant('code')"
      >
        code
      </of-button>
      <of-button
        @click="editor.chain().focus().setParagraph().run()"
        density="3"
        :variant="getVariant('paragraph')"
      >
        paragraph
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        density="3"
        :variant="getVariant('heading', { level: 1 })"
      >
        h1
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        density="3"
        :variant="getVariant('heading', { level: 2 })"
      >
        h2
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        density="3"
        :variant="getVariant('heading', { level: 3 })"
      >
        h3
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        density="3"
        :variant="getVariant('heading', { level: 4 })"
      >
        h4
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        density="3"
        :variant="getVariant('heading', { level: 5 })"
      >
        h5
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        density="3"
        :variant="getVariant('heading', { level: 6 })"
      >
        h6
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleBulletList().run()"
        density="3"
        :variant="getVariant('bulletList')"
      >
        bullet list
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleOrderedList().run()"
        density="3"
        :variant="getVariant('orderedList')"
      >
        ordered list
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        density="3"
        :variant="getVariant('codeBlock')"
      >
        code block
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleBlockquote().run()"
        density="3"
        :variant="getVariant('blockquote')"
      >
        blockquote
      </of-button>
      <of-button
        @click="editor.chain().focus().setHorizontalRule().run()"
        density="3"
        variant="text"
      >
        horizontal rule
      </of-button>
      <of-button
        @click="editor.chain().focus().setHardBreak().run()"
        density="3"
        variant="text"
      >
        hard break
      </of-button>
      <of-button
        @click="editor.chain().focus().undo().run()"
        density="3"
        variant="text"
      >
        undo
      </of-button>
      <of-button
        @click="editor.chain().focus().redo().run()"
        density="3"
        variant="text"
        >redo</of-button
      >
      <of-button
        @click="editor.chain().focus().setTextAlign('left').run()"
        density="3"
        :variant="getVariant({ textAlign: 'left' })"
      >
        left
      </of-button>
      <of-button
        @click="editor.chain().focus().setTextAlign('center').run()"
        density="3"
        :variant="getVariant({ textAlign: 'center' })"
      >
        center
      </of-button>
      <of-button
        @click="editor.chain().focus().setTextAlign('right').run()"
        density="3"
        :variant="getVariant({ textAlign: 'right' })"
      >
        right
      </of-button>
      <of-button
        @click="editor.chain().focus().setTextAlign('justify').run()"
        density="3"
        :variant="getVariant({ textAlign: 'justify' })"
      >
        justify
      </of-button>
      <of-button @click="addImage" density="3" variant="text">image</of-button>
      <of-button @click="addLink" density="3" variant="text">link</of-button>
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
import { useEditor, EditorContent } from '@tiptap/vue-3'
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
  },
  emits: {
    'update:modelValue': null,
    updated: null,
  },
  setup(props, ctx: SetupContext) {
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
        if (htmlValue !== null) {
          value = htmlValue
        } else if (textValue !== null) {
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

    const editor = useEditor({
      content: fieldValue.value,
      extensions: [
        StarterKit,
        Image,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Link,
      ],
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

    return { editor, getVariant, addImage, addLink }
  },
})
</script>
