import { computed, h, Ref, ref, watch } from 'vue'
import { useFormats } from '../lib/formats'

import {
    defineFieldType,
    FieldContext,
    FieldProps,
    newFieldId,
    fieldRender,
} from '../lib/fields'

import { OfIcon } from '../components/Icon';
import { DateTimeFormatter } from 'src/formats/DateTime';
import OfDateTimePopup from '../components/DateTimePopup.vue'


export const renderDateTimePopup = (close: (date?: Date) => any, selectedDate: Ref<Date>, monthStart: Ref<Date>): any => {
    return h(
        OfDateTimePopup,
        {
            date: selectedDate,
            monthStart,
            withTime: true,
            accept: close,
        }
    )

}

export const DateTimeField = defineFieldType({
    name: 'datetime',
    class: 'of-datetime-field',
    setup(props: FieldProps, ctx: FieldContext) {
        const formatMgr = useFormats()
        const formatter = computed(
            () => formatMgr.getTextFormatter("datetime", { dateFormat: 'short', time: true }) as DateTimeFormatter
        )

        const parseDate = (value: any) => {
            const df = formatter.value
            try {
                const loadedValue = df.loadValue(value)
                if (loadedValue instanceof Date) value = loadedValue
            } catch (e) { }
            return value
        }

        const initialValue = computed(() => {
            let initial = ctx.initialValue
            if (initial === undefined) initial = props.defaultValue
            initial = parseDate(initial)
            return initial ?? null
        })

        const stateValue = ref()
        const opened = ref(false)
        const editable = computed(() => ctx.mode === 'edit' && !ctx.locked)
        let defaultFieldId: string
        const inputId = computed(() => {
            let id = ctx.id
            if (!id) {
                if (!defaultFieldId) defaultFieldId = newFieldId()
                id = defaultFieldId
            }
            return id
        })

        const currentDate = ref(new Date)
        const editableDate = ref(new Date)
        const monthStart = ref(new Date)

        const closePopup = () => {
            opened.value = false
        }

        watch(
            () => ctx.value,
            (val) => {
                if (val === undefined || val === '') val = null
                const loaded = parseDate(val)
                if (loaded instanceof Date) {
                    currentDate.value = loaded
                    monthStart.value = loaded
                    stateValue.value = val
                }
            },
            {
                immediate: true,
            }
        )

        const clickOpen = (_evt?: MouseEvent) => {
            editableDate.value = new Date(currentDate.value.valueOf())
            monthStart.value = new Date(currentDate.value.valueOf())
            opened.value = true
            return false
        }

        const acceptResult = (date?: Date) => {
            if (date && ctx.onUpdate) ctx.onUpdate(formatter.value.formatPortable(date))
            opened.value = false
        }

        const renderPopup = () => {
            return renderDateTimePopup(acceptResult, editableDate, monthStart)
        }

        return fieldRender({
            content: () => {
                const val = formatter.value?.format(stateValue.value)
                const value = val?.textValue
                return [
                    h(
                        'div',
                        {
                            class: [
                                'of-field-input-label',
                                'of--align-' + (props.align || 'start'),
                            ],
                            id: inputId.value,
                            tabindex: 0,
                        },
                        value
                    ),
                ]
            },
            updated: computed(() => {
                return initialValue.value !== stateValue.value
            }),
            cursor: computed(() => editable.value ? "pointer" : "default"),
            click: computed(() => editable.value ? clickOpen : null),
            inputId,
            popup: {
                content: renderPopup,
                visible: opened,
                onBlur: closePopup,
            },
            value: stateValue,
            append() {
                return [
                    h(OfIcon, {
                        name: 'date',
                        size: 'input',
                    }),
                    h(OfIcon, {
                        name: 'time',
                        size: 'input',
                    }),
                ]
            },
        })
    }
})

