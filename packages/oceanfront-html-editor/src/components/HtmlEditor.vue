<template>
  <div
    :class="[
      'of-field',
      'of-editor',
      'of--active',
      isEditable ? 'of--interactive' : '',
      isEditable ? 'of--cursor-text' : 'of--cursor-normal',
      isEditable ? 'of--label-top' : '',
      isEditable ? 'of--mode-editable' : 'of--mode-fixed',
      focused ? 'of--focused' : '',
      'of--variant-outlined',
      'of--tint-undefined',
      isEditable ? 'of-text-field' : '',
    ]"
    :style="style"
  >
    <div class="of-field-main-label" @click="setFocus('end')">
      <label class="of-field-label">{{ label }}</label>
    </div>
    <div class="of-field-main">
      <div class="of--layer of--layer-bg"></div>
      <div class="of--layer of--layer-brd"></div>
      <div class="of--layer of--layer-outl"></div>
      <div class="of-field-header"></div>
      <div class="of-field-body of-editor-body">
        <div class="of-field-inner">
          <div class="of-field-content-text of--align-start of--unpadded">
            <div v-if="editor && isEditable" class="editor-toolbar">
              <template v-for="(row, index) in menuRows" :key="index">
                <div class="editor-toolbar-row">
                  <template v-for="item in row" :key="item.name">
                    <div class="divider" v-if="item.type === 'divider'"></div>
                    <of-select-field
                      v-else-if="item.type === 'select'"
                      v-bind="item"
                      density="3"
                    />
                    <of-color-field
                      v-else-if="item.type === 'color'"
                      v-bind="item"
                      density="3"
                    />
                    <of-button
                      density="3"
                      :variant="item.variant"
                      @click="item.click"
                      :icon="item.icon"
                      :title="item.title"
                      v-else
                    />
                  </template>
                </div>
              </template>
              <hr class="editor-toolbar-border" />
            </div>
            <editor-content
              :editor="editor"
              class="editor-outer"
              @click="setFocus(undefined)"
            />
            <div class="editor-footer" ref="footer" v-if="isEditable">
              <slot name="editor-footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <slot name="extra" v-if="isEditable">
    <of-dialog class="of-editor-popup" v-model="tableDialogActive">
      <of-field v-bind="tableRowsFieldProps" />
      <of-field v-bind="tableColumnsFieldProps" />
      <of-field v-bind="tableHeaderFieldProps" />
      <of-button @click="closeTableDialog">Cancel</of-button>
      <of-button @click="addTable">Apply</of-button>
    </of-dialog>
    <of-dialog class="of-editor-popup insert" v-model="linkDialogActive">
      <of-field v-bind="linkFieldProps" />
      <of-button @click="closeLinkDialog">Cancel</of-button>
      <of-button @click="addLink">Apply</of-button>
    </of-dialog>
    <of-dialog class="of-editor-popup insert" v-model="imageDialogActive">
      <of-field v-bind="imageFieldProps" />
      <of-button @click="closeImageDialog">Cancel</of-button>
      <of-button @click="addImage">Apply</of-button>
    </of-dialog>
  </slot>
</template>

<script lang="ts">
import {
  defineComponent,
  watch,
  PropType,
  computed,
  ComputedRef,
  ref,
  Ref,
  SetupContext,
  onMounted,
} from 'vue'
import {
  useEditor,
  EditorContent,
  Extension,
  FocusPosition,
} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Color from '@tiptap/extension-color'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { FontSize } from '../extensions/font_size'
import { FormRecord } from 'oceanfront'

type ToolbarMenuItem = {
  name: string
  icon: string
  title: string
  variant: string
  type?: string
  items?: Array<any>
  click?: Function
}

export default defineComponent({
  name: 'OfHtmlEditor',
  components: {
    EditorContent,
  },
  props: {
    name: String,
    label: String,
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
    toolbarItems: {
      type: Array as PropType<String[]>,
      default: () => [],
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
    const focused: Ref<boolean> = ref(false)
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

    const font: Ref<string> = ref('default')

    const fonts = [
      { text: 'Default Font', value: 'default' },
      { text: 'Inter', value: 'Inter' },
      { text: 'Comic Sans', value: 'Comic Sans MS, Comic Sans' },
      { text: 'Serif', value: 'serif' },
      { text: 'Monospace', value: 'monospace' },
      { text: 'Cursive', value: 'cursive' },
    ]

    const getFontSizes = (): number[] => {
      let result: number[] = []
      let size = 8

      while (size <= 28) {
        result.push(size)
        let step = size >= 12 ? 2 : 1
        size += step
      }

      result = result.concat([36, 48, 72])

      return result
    }

    const fontSizeValue: Ref<string> = ref('default')

    const fontSizeItems: ComputedRef<any[]> = computed(() => {
      return [
        { text: 'Size', value: 'default' },
        ...getFontSizes().map((size: number) => {
          return { text: String(size), value: String(size) }
        }),
      ]
    })

    const colorValue: Ref<string> = ref('#000000')

    const tableDialogActive: Ref<boolean> = ref(false)
    const tableRows: Ref<number> = ref(3)
    const tableColumns: Ref<number> = ref(2)
    const tableWithHeader: Ref<boolean> = ref(false)

    const tableRowsFieldProps = computed(() => {
      return {
        format: {
          type: 'text',
        },
        modelValue: tableRows.value,
        'onUpdate:modelValue': (val: number) => {
          tableRows.value = val
        },
        label: 'Rows',
        id: 'table_rows',
        name: 'table_rows',
        type: 'text',
      }
    })

    const tableColumnsFieldProps = computed(() => {
      return {
        format: {
          type: 'text',
        },
        modelValue: tableColumns.value,
        'onUpdate:modelValue': (val: number) => {
          tableColumns.value = val
        },
        label: 'Columns',
        id: 'table_columns',
        name: 'table_columns',
        type: 'text',
      }
    })

    const tableHeaderFieldProps = computed(() => {
      return {
        type: 'toggle',
        name: 'add_header',
        label: 'With Header',
        id: 'add_header',
        format: {
          type: 'toggle',
          inputType: 'switch',
        },
        modelValue: tableWithHeader.value,
        'onUpdate:modelValue': (val: boolean) => {
          tableWithHeader.value = val
        },
      }
    })

    const closeTableDialog = () => {
      tableDialogActive.value = false
    }

    const addTable = () => {
      closeTableDialog()
      console.log(tableRows.value)
      console.log(tableColumns.value)
      console.log(tableWithHeader.value)
      editor.value
        .chain()
        .focus()
        .insertTable({
          rows: tableRows.value,
          cols: tableColumns.value,
          withHeaderRow: tableWithHeader.value,
        })
        .run()
    }

    const imageDialogActive: Ref<boolean> = ref(false)
    const imageUrl: Ref<string> = ref('')

    const imageFieldProps = computed(() => {
      return {
        format: {
          type: 'text',
        },
        modelValue: imageUrl.value,
        'onUpdate:modelValue': (val: string) => {
          imageUrl.value = val
        },
        label: 'URL',
        id: 'image-url',
        name: 'image-url',
        type: 'text',
      }
    })

    const closeImageDialog = () => {
      imageDialogActive.value = false
    }

    const addImage = () => {
      closeImageDialog()
      if (imageUrl.value) {
        editor.value.chain().focus().setImage({ src: imageUrl.value }).run()
      }
    }

    const linkDialogActive: Ref<boolean> = ref(false)
    const link: Ref<string> = ref('')

    const linkFieldProps = computed(() => {
      return {
        format: {
          type: 'text',
        },
        modelValue: link.value,
        'onUpdate:modelValue': (val: string) => {
          link.value = val
        },
        label: 'URL',
        id: 'link',
        name: 'link',
        type: 'text',
      }
    })

    const closeLinkDialog = () => {
      linkDialogActive.value = false
    }

    const addLink = () => {
      closeLinkDialog()
      if (link.value) {
        editor.value
          .chain()
          .focus()
          .setLink({ href: link.value, target: '_blank' })
          .run()
      }
    }

    watch(
      () => props.modelValue,
      (value: string) => {
        if (!record.value) {
          const isSame = editor.value.getHTML() === value
          if (isSame) return
          editor.value.commands.setContent(value, false)
        }
      }
    )

    watch(
      () => record.value?.value[htmlFieldName.value as string],
      (value: string) => {
        const isSame = editor.value.getHTML() === value
        if (isSame) return
        editor.value.commands.setContent(value, false)
      }
    )

    watch(
      () => isEditable.value,
      (value: boolean) => {
        editor.value.setEditable(value)
      }
    )

    watch(
      () => font.value,
      (value: string) => {
        if (value === 'default') {
          editor.value.chain().focus().unsetFontFamily().run()
        } else {
          editor.value.chain().focus().setFontFamily(value).run()
        }
      }
    )

    watch(
      () => fontSizeValue.value,
      (value: string) => {
        if (value === 'default') {
          editor.value.chain().focus().unsetFontSize().run()
        } else {
          editor.value.chain().focus().setFontSize(`${value}px`).run()
        }
      }
    )

    watch(
      () => colorValue.value,
      (value: string) => {
        editor.value.chain().setColor(value).run()
      }
    )

    const coreExtensions = [
      StarterKit,
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link,
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
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
      onFocus: () => {
        focused.value = true
      },
      onBlur: () => {
        focused.value = false
      },
    })

    const getVariant = (name: any, params = {}): string => {
      return editor.value.isActive(name, params) ? 'filled' : 'text'
    }

    const getMenuRow1 = (): ToolbarMenuItem[] => {
      const menu: Map<string, ToolbarMenuItem[]> = new Map([
        [
          'action',
          [
            {
              name: 'undo',
              icon: 'undo',
              title: 'Undo',
              variant: 'text',
              click: () => editor.value.chain().focus().undo().run(),
            },
            {
              name: 'redo',
              icon: 'redo',
              title: 'Redo',
              variant: 'text',
              click: () => editor.value.chain().focus().redo().run(),
            },
          ],
        ],
        [
          'insert',
          [
            {
              name: 'add-image',
              icon: 'insert-photo',
              title: 'Image',
              variant: 'text',
              click: () => {
                imageUrl.value = ''
                imageDialogActive.value = true
              },
            },
            {
              name: 'add-link',
              icon: 'insert-link',
              title: 'Set Link',
              variant: 'text',
              click: () => {
                link.value = ''
                linkDialogActive.value = true
              },
            },
            {
              name: 'add-table',
              icon: 'table',
              title: 'Table',
              variant: 'text',
              click: () => (tableDialogActive.value = true),
            },
            {
              name: 'horizontal-line',
              icon: 'separator',
              title: 'Insert Horizontal Line',
              variant: 'text',
              click: () =>
                editor.value.chain().focus().setHorizontalRule().run(),
            },
          ],
        ],
        [
          'style',
          [
            {
              name: 'paragraph',
              icon: 'paragraph',
              title: 'Paragraph',
              variant: getVariant('paragraph'),
              click: () => editor.value.chain().focus().setParagraph().run(),
            },
            {
              name: 'heading-1',
              icon: 'h-1',
              title: 'Heading 1',
              variant: getVariant('heading', { level: 1 }),
              click: () =>
                editor.value.chain().focus().toggleHeading({ level: 1 }).run(),
            },
            {
              name: 'heading-2',
              icon: 'h-2',
              title: 'Heading 2',
              variant: getVariant('heading', { level: 2 }),
              click: () =>
                editor.value.chain().focus().toggleHeading({ level: 2 }).run(),
            },
            {
              name: 'heading-3',
              icon: 'h-3',
              title: 'Heading 3',
              variant: getVariant('heading', { level: 3 }),
              click: () =>
                editor.value.chain().focus().toggleHeading({ level: 3 }).run(),
            },
          ],
        ],
      ])

      return compactMenuItems(menu)
    }

    const getMenuRow2 = (): ToolbarMenuItem[] => {
      const menu: Map<string, ToolbarMenuItem[]> = new Map([
        [
          'format',
          [
            {
              name: 'bold',
              icon: 'format bold',
              title: 'Bold',
              variant: getVariant('bold'),
              click: () => editor.value.chain().focus().toggleBold().run(),
            },
            {
              name: 'italic',
              icon: 'format italic',
              title: 'Italic',
              variant: getVariant('italic'),
              click: () => editor.value.chain().focus().toggleItalic().run(),
            },
            {
              name: 'underline',
              icon: 'format underline',
              title: 'Underline',
              variant: getVariant('underline'),
              click: () => editor.value.chain().focus().toggleUnderline().run(),
            },
            {
              name: 'strike',
              icon: 'format strikethrough',
              title: 'Strike',
              variant: getVariant('strike'),
              click: () => editor.value.chain().focus().toggleStrike().run(),
            },
          ],
        ],
        [
          'highlight',
          [
            {
              name: 'code',
              icon: 'code',
              title: 'Code',
              variant: getVariant('code'),
              click: () => editor.value.chain().focus().toggleCode().run(),
            },
            {
              name: 'highlight',
              icon: 'highlight',
              title: 'Highlight',
              variant: getVariant('highlight'),
              click: () =>
                editor.value
                  .chain()
                  .focus()
                  .toggleHighlight({ color: '#74c0fc' })
                  .run(),
            },
          ],
        ],
        [
          'align',
          [
            {
              name: 'align-left',
              icon: 'format align-left',
              title: 'Left',
              variant: getVariant({ textAlign: 'left' }),
              click: () =>
                editor.value.chain().focus().setTextAlign('left').run(),
            },
            {
              name: 'align-center',
              icon: 'format align-center',
              title: 'Center',
              variant: getVariant({ textAlign: 'center' }),
              click: () =>
                editor.value.chain().focus().setTextAlign('center').run(),
            },
            {
              name: 'align-right',
              icon: 'format align-right',
              title: 'Right',
              variant: getVariant({ textAlign: 'right' }),
              click: () =>
                editor.value.chain().focus().setTextAlign('right').run(),
            },
            {
              name: 'align-justify',
              icon: 'format align-justify',
              title: 'Justify',
              variant: getVariant({ textAlign: 'justify' }),
              click: () =>
                editor.value.chain().focus().setTextAlign('justify').run(),
            },
          ],
        ],
        [
          'clear',
          [
            {
              name: 'clear',
              icon: 'format clear',
              title: 'Clear Format',
              variant: 'text',
              click: () => editor.value.chain().focus().clearNodes().run(),
            },
            {
              name: 'wrap',
              icon: 'wrap-text',
              title: 'Hard Break',
              variant: 'text',
              click: () => editor.value.chain().focus().setHardBreak().run(),
            },
          ],
        ],
        [
          'font',
          [
            {
              name: 'text-color',
              icon: '',
              title: 'Text Color',
              variant: 'text',
              type: 'color',
              modelValue: colorValue.value,
              'onUpdate:modelValue': (value: string) => {
                colorValue.value = value
              },
            },
            {
              name: 'font-family',
              icon: '',
              title: 'Font Family',
              variant: 'text',
              type: 'select',
              items: fonts,
              modelValue: font.value,
              'onUpdate:modelValue': (value: string) => {
                font.value = value
              },
            },
            {
              name: 'font-size',
              icon: '',
              title: 'Font Size',
              variant: 'text',
              type: 'select',
              items: fontSizeItems.value,
              modelValue: fontSizeValue.value,
              'onUpdate:modelValue': (value: string) => {
                fontSizeValue.value = value
              },
            },
          ],
        ],
        [
          'format-2',
          [
            {
              name: 'numbered-list',
              icon: 'format list-numbered',
              title: 'Ordered List',
              variant: getVariant('orderedList'),
              click: () =>
                editor.value.chain().focus().toggleOrderedList().run(),
            },
            {
              name: 'bulleted-list',
              icon: 'format list-bulleted',
              title: 'Bullet List',
              variant: getVariant('bulletList'),
              click: () =>
                editor.value.chain().focus().toggleBulletList().run(),
            },
            {
              name: 'code-block',
              icon: 'developer-mode',
              title: 'Code Block',
              variant: getVariant('codeBlock'),
              click: () => editor.value.chain().focus().toggleCodeBlock().run(),
            },
            {
              name: 'blockquote',
              icon: 'format quote',
              title: 'Blockquote',
              variant: getVariant('blockquote'),
              click: () =>
                editor.value.chain().focus().toggleBlockquote().run(),
            },
          ],
        ],
      ])

      return compactMenuItems(menu)
    }

    const menuRows = computed(() => {
      return {
        row1: getMenuRow1(),
        row2: getMenuRow2(),
      }
    })

    const compactMenuItems = (menu: Map<string, ToolbarMenuItem[]>) => {
      let result: ToolbarMenuItem[] = []

      menu.forEach((items, _section) => {
        const sectionItems = items.filter(
          (item: ToolbarMenuItem) =>
            props.toolbarItems.length === 0 ||
            props.toolbarItems.includes(item.name)
        )
        if (result.length > 0 && sectionItems.length > 0) {
          result.push({
            name: 'divider',
            icon: '',
            title: '',
            variant: '',
            type: 'divider',
          })
        }
        result = [...result, ...sectionItems]
      })

      return result
    }

    const setFocus = (
      position: FocusPosition | undefined = undefined
    ): void => {
      editor.value.commands.focus(position)
    }

    const footer = ref<HTMLElement | null>(null)
    const footerIsEmpty: Ref<boolean> = ref(true)
    const style = computed(() => {
      return footerIsEmpty.value
        ? '--of-editor-content-height: 255px; --of-editor-editable-area-height: 300px;'
        : '--of-editor-content-height: 320px; --of-editor-editable-area-height: 400px;'
    })

    onMounted(() => {
      if (footer.value?.textContent || footer.value?.innerHTML) {
        footerIsEmpty.value = false
      }
    })

    return {
      editor,
      isEditable,
      focused,
      setFocus,
      footer,
      style,
      menuRows,
      tableDialogActive,
      tableRowsFieldProps,
      tableColumnsFieldProps,
      tableHeaderFieldProps,
      closeTableDialog,
      addTable,
      linkDialogActive,
      linkFieldProps,
      closeLinkDialog,
      addLink,
      imageDialogActive,
      imageFieldProps,
      closeImageDialog,
      addImage,
    }
  },
})
</script>
