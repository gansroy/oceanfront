import { computed, h, Ref, ref, watch } from 'vue'
import { useFormats } from '../lib/formats'

import {
    defineFieldType,
    FieldContext,
    FieldProps,
    newFieldId,
    fieldRender,
} from '../lib/fields'

import { monthGrid, sameDate, prevMonth, nextMonth, MonthGridCell } from '../lib/datetime'
import { OfIcon } from '../components/Icon';
import { DateTimeFormatter } from 'src/formats/DateTime';

const expand = (value: string | number, digits = 2): string => {
    let expanded = '' + value
    while (expanded.length < digits) {
        expanded = '0' + expanded
    }
    return expanded
}

interface MonthGridProps {
    monthStart: Date
    disabledDate?: (cell: MonthGridCell) => any
    onSelect?: (cell: MonthGridCell) => any
    isSelected?: (cell: MonthGridCell) => boolean
}

interface TimeSelectorProps {
    date: Ref<Date>
    useAMPM?: boolean
    onChange?: (hour: number, minute: number) => any
}

const renderMonthGrid = (props: MonthGridProps) => {
    const gridData = monthGrid(props.monthStart)
    const cells: any[] = []
    gridData.grid.forEach(row => {
        row.forEach(cell => {
            cells.push(
                h('div', {
                    class: [
                        'picker-date',
                        {
                            'other-month': cell.otherMonth,
                            'selected-date': props.isSelected?.(cell) || false,
                            'today': cell.today,
                        }
                    ],
                    onclick: props.onSelect ? () => props.onSelect?.(cell) : null,
                }, cell.date.getDate())
            )
        })
    })

    return cells
}

function renderTimeSelector(props: TimeSelectorProps) {

    const limits = { h: props.useAMPM ? 12 : 23, m: 59 }

    const values = { h: props.date.value.getHours(), m: props.date.value.getMinutes() }

    const updateValue = (which: 'h' | 'm', forceDelta?: number) => (e: any) => {
        // FIXME: test on high-resolution scrolling
        // devices such as App trackpads. The 120 magic
        // constant may not work there
        const delta = forceDelta ?? parseInt((e.wheelDeltaY / 120).toFixed(0))
        let newValue = values[which] + delta
        if (newValue < 0) newValue = 0
        if (newValue > limits[which]) newValue = limits[which]
        values[which] = newValue
        const date = new Date(props.date.value.valueOf())
        date.setHours(values.h, values.m)
        props.date.value = date
    }

    const iconProps = {
        name: 'triangle-up',
        size: 'lg',
        class: 'time-picker-arrow',
        onselectstart: (e: any) => { e.preventDefault() },
    }

    return h(
        'div',
        { class: 'of-time-selector', },
        [
            h('div'),
            h('div'),
            h('div'),
            h('div'),
            h('div'),

            h('div'),
            h(OfIcon, { ...iconProps, onclick: updateValue('h', 1) }),
            h('div'),
            h(OfIcon, { ...iconProps, onclick: updateValue('m', 1) }),
            h('div'),

            h('div'),
            h('div', { class: 'time-value', onmousewheel: updateValue('h') }, expand(values.h)),
            h('div', { class: 'time-value', }, ':'),
            h('div', { class: 'time-value', onmousewheel: updateValue('m') }, expand(values.m)),
            h('div'),

            h('div'),
            h(OfIcon, { ...iconProps, name: 'triangle-down', onclick: updateValue('h', -1) }),
            h('div'),
            h(OfIcon, { ...iconProps, name: 'triangle-down', onclick: updateValue('m', -1) }),
            h('div'),

            h('div'),
            h('div'),
            h('div'),
            h('div'),
            h('div'),
        ]
    )
}

export const renderDateTimePopup = (close: (date?: Date) => any, monthStart: Ref<Date>, selectedDate: Ref<Date>, time: TimeSelectorProps): any => {
    const gridProps: MonthGridProps = {
        monthStart: monthStart.value,
        isSelected: (cell: MonthGridCell) => sameDate(cell.date, selectedDate.value),
        onSelect: (cell: MonthGridCell) => {
            if (cell.otherMonth) return
            const date = new Date(cell.date.valueOf())
            date.setHours(time.date.value.getHours(), time.date.value.getMinutes())
            selectedDate.value = date
        },
    }
    const cells = renderMonthGrid(gridProps)

    const times = renderTimeSelector(time)

    const formatMgr = useFormats()
    const titleFormat = formatMgr.getTextFormatter("datetime", { nativeOptions: { month: "short", year: "numeric", day: "numeric", weekday: 'short', hour: 'numeric', minute: 'numeric' } })
    const monthFormat = formatMgr.getTextFormatter("datetime", { nativeOptions: { month: "short", year: "numeric" } })
    const title = h(
        h(
            'div',
            { class: 'of-date-picker-title' },
            h('div', titleFormat?.format(selectedDate.value).textValue,)
        )
    )
    return h(
        'div',
        { role: 'menu', class: 'of-menu of-datepicker-popup with-time' },
        h('div', {}, [
            title,
            h('div', { class: 'of-datepicker-selectors' },
                [
                    h('div', { class: 'of-datepicker-grid' }, [
                        h('div', { class: 'of-datepicker-nav-button prev', onclick: () => monthStart.value = prevMonth(monthStart.value) },
                            h(OfIcon, {
                                name: 'arrow-left',
                            })
                        ),
                        h('div', { class: "of-date-picker-cur-year" }, monthFormat?.format(monthStart.value).textValue),
                        h('div', { class: 'of-datepicker-nav-button next', onclick: () => monthStart.value = nextMonth(monthStart.value) },
                            h(OfIcon, {
                                name: 'arrow-right',
                            })
                        ),
                        cells,
                    ]),
                    times
                ]
            ),
            h('div', { class: 'of-date-picker-buttons' }, [
                h('div', { class: 'of-date-picker-button accept', onclick: () => close(selectedDate.value) }, 'Accept'),
                h('div', { class: 'of-date-picker-button cancel', onclick: () => close() }, 'Cancel'),
            ])
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
        const monthStart = ref(new Date)
        const hour = ref(0)
        const minute = ref(0)

        watch(
            [hour, minute],
            (values) => {
                const [hour, minute] = values
                const date = new Date(currentDate.value.valueOf())
                date.setHours(hour, minute)
                currentDate.value = date
            }
        )

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
                    stateValue.value = val
                }
            },
            {
                immediate: true,
            }
        )

        const clickOpen = (_evt?: MouseEvent) => {
            monthStart.value = currentDate.value
            opened.value = true
            return false
        }

        const acceptResult = (date?: Date) => {
            if (date && ctx.onUpdate) ctx.onUpdate(formatter.value.formatPortable(date))
            opened.value = false
        }

        const renderPopup = () => {
            return renderDateTimePopup(acceptResult, monthStart, currentDate, { date: currentDate })
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

