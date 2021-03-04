import { computed, h, ref, watch } from 'vue'
import { useFormats } from '../lib/formats'

import {
    defineFieldType,
    FieldContext,
    FieldProps,
    newFieldId,
    fieldRender,
} from '../lib/fields'

import { monthGrid, MonthGridData, MonthGrid } from '../lib/datetime'
import { OfIcon } from '../components/Icon';
import { DateTimeFormatter } from 'src/formats/DateTime';

export const renderDateTimePopup = (g: MonthGrid, data: MonthGridData): any => {
    if (!data) return ''
    const cells: any[] = []
    data.grid.forEach(row => {
        row.forEach(cell => {
            cells.push(
                h('div', {
                    class: [
                        'picker-date',
                        {
                            'other-month': cell.otherMonth,
                            'selected-date': cell.selected,
                            'today': cell.today,
                        }
                    ],
                    onclick: cell.otherMonth ? null : () => g.selectedDate = cell.date
                }, cell.date.getDate())
            )
        })
    })

    const formatMgr = useFormats()
    const titleFormat = formatMgr.getTextFormatter("datetime", { nativeOptions: { month: "short", year: "numeric", day: "numeric", weekday: 'short' } })
    const monthFormat = formatMgr.getTextFormatter("datetime", { nativeOptions: { month: "short", year: "numeric" } })
    const title = h(
        h(
            'div',
            { class: 'of-date-picker-title' },
            [
                h('div', titleFormat?.format(g.selectedDate).textValue),
            ]
        )
    )
    return h(
        'div',
        { role: 'menu', class: 'of-menu of-datepicker-popup' },
        h('div', { class: 'of-datepicker-grid' }, [
            title,
            h('div', { class: 'of-datepicker-nav-button prev', onclick: () => g.prevMonth() },
                h(OfIcon, {
                    name: 'arrow-left',
                })
            ),
            h('div', { class: "of-date-picker-cur-year" }, monthFormat?.format(g.monthStart).textValue),
            h('div', { class: 'of-datepicker-nav-button next', onclick: () => g.nextMonth() },
                h(OfIcon, {
                    name: 'arrow-right',
                })
            ),
            cells,
        ]
        )
    )
}


export const DateTimeField = defineFieldType({
    name: 'datetime',
    class: 'of-datetime-field',
    setup(props: FieldProps, ctx: FieldContext) {
        const formatMgr = useFormats()

        const formatter = computed(
            () => formatMgr.getTextFormatter("datetime", props.formatOptions) as DateTimeFormatter
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

        const gridData = ref(null as unknown as MonthGridData)
        let g: MonthGrid | undefined

        const closePopup = () => {
            g = undefined
            opened.value = false
        }

        watch(
            () => ctx.value,
            (val) => {
                if (val === undefined || val === '') val = null
                const loaded = parseDate(val)
                if (loaded instanceof Date) {
                    stateValue.value = val
                }
            },
            {
                immediate: true,
            }
        )

        const clickOpen = (_evt?: MouseEvent) => {
            opened.value = true
            return false
        }

        const renderPopup = () => {
            if (!g) {
                g = monthGrid((data: MonthGridData) => {
                    if (data.newDate) {
                        opened.value = false
                        if (ctx.onUpdate) ctx.onUpdate(formatter.value.formatPortable(g?.selectedDate))
                    }
                    gridData.value = data
                }, parseDate(stateValue.value))
            }
            return renderDateTimePopup(g, gridData.value)
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
        })
    }
})

