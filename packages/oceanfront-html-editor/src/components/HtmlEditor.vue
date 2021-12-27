<template>
  <div class="of-field editor">
    <div v-if="editor" class="editor-toolbar">
      <of-button
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
        density="3"
        variant="text"
      >
        bold
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        density="3"
        variant="text"
      >
        italic
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        density="3"
        variant="text"
      >
        strike
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
        density="3"
        variant="text"
      >
        code
      </of-button>
      <of-button
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }"
        density="3"
        variant="text"
      >
        paragraph
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        density="3"
        variant="text"
      >
        h1
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        density="3"
        variant="text"
      >
        h2
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        density="3"
        variant="text"
      >
        h3
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        density="3"
        variant="text"
      >
        h4
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        density="3"
        variant="text"
      >
        h5
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        density="3"
        variant="text"
      >
        h6
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
        density="3"
        variant="text"
      >
        bullet list
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
        density="3"
        variant="text"
      >
        ordered list
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        density="3"
        variant="text"
      >
        code block
      </of-button>
      <of-button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
        density="3"
        variant="text"
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
        >undo</of-button
      >
      <of-button
        @click="editor.chain().focus().redo().run()"
        density="3"
        variant="text"
        >redo</of-button
      >
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

export default defineComponent({
  name: 'OfHtmlEditor',
  components: {
    EditorContent,
  },
  props: {},
  setup(_props) {
    const editor = useEditor({
      content: '<p>Test HTML2</p>',
      extensions: [StarterKit],
    })

    return { editor }
  },
})
</script>
