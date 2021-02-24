import { computed, h, ref } from 'vue'
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
            () => formatMgr.getTextFormatter(props.type, props.formatOptions)
        )
        const opened = ref(false)
        const editable = computed(() => ctx.mode === 'edit' || ctx.locked || false)
        let defaultFieldId: string
        const inputId = computed(() => {
            let id = ctx.id
            if (!id) {
                if (!defaultFieldId) defaultFieldId = newFieldId()
                id = defaultFieldId
            }
            return id
        })
        const closePopup = () => { opened.value = false }
        const gridData = ref(null as unknown as MonthGridData)
        const g = monthGrid((g: MonthGridData) => {
            if (g.newDate) {
                opened.value = false
            }
            gridData.value = g
        })

        if (formatter.value instanceof DateTimeFormatter) {
            const df = formatter.value as DateTimeFormatter
            try {
                const loadedValue = df.loadValue(ctx.value)
                if (loadedValue instanceof Date) g.selectedDate = loadedValue
            } catch (e) { }
        }

        const clickOpen = (_evt?: MouseEvent) => {
            g.selectedDate = g.selectedDate
            opened.value = true
            return false
        }
        return fieldRender({
            content: () => {
                const val = formatter.value?.format(g.selectedDate)
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
            cursor: editable.value ? "pointer" : "default",
            click: clickOpen,
            inputId,
            popup: {
                content: () => renderDateTimePopup(g, gridData.value),
                visible: opened,
                onBlur: closePopup,
            },
        })
    }
})
