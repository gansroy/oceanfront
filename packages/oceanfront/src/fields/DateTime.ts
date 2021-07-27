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
import { DateFormatter, DateTimeFormatter, TimeFormatter } from 'src/formats/DateTime';
import OfDateTimePopup from '../components/DateTimePopup.vue'

type InputType = 'date' | 'datetime' | 'time'

type RenderOpts = {
    close: (date?: Date) => any,
    selectedDate: Ref<Date>,
    monthStart: Ref<Date>
    withTime: boolean,
    withDate: boolean,
}

export const renderDateTimePopup = (opts: RenderOpts): any => {
    return h(
        OfDateTimePopup,
        {
            date: opts.selectedDate,
            monthStart: opts.monthStart,
            withTime: opts.withTime,
            withDate: opts.withDate,
            accept: opts.close,
        }
    )

}

const fieldSetup = (type: InputType) => (props: FieldProps, ctx: FieldContext) => {
    const withTime = type == 'datetime' || type == 'time'
    const withDate = type == 'datetime' || type == 'date'
    const withClear = !ctx.required
    const formatMgr = useFormats()
    const formatter = computed(
        () => {
            switch (type) {
                case 'date': return formatMgr.getTextFormatter(
                    'date', { dateFormat: 'short' }) as DateFormatter
                case 'time': return formatMgr.getTextFormatter(
                    'time', { dateFormat: 'short' }) as TimeFormatter
                default: return formatMgr.getTextFormatter(
                    'datetime', { dateFormat: 'short' }) as DateTimeFormatter
            }
        }
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
            } else {
                currentDate.value = new Date()
                monthStart.value = new Date()
                stateValue.value = ""
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
        return renderDateTimePopup({
            close: acceptResult,
            selectedDate: editableDate,
            monthStart,
            withTime,
            withDate,
        })
    }

    return fieldRender({
        content: () => {
            const value = stateValue.value ?
                formatter.value?.format(stateValue.value)?.textValue
                : ""
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
                withDate ? h(OfIcon, {
                    name: 'date',
                    size: 'input',
                }) : null,
                withTime && !withDate ? h(OfIcon, {
                    name: 'time',
                    size: 'input',
                }) : null,
                withClear ? h(OfIcon, {
                    name: 'circle-cross',
                    size: 'input',
                    onClick: (e: MouseEvent | TouchEvent) => {
                        e.stopPropagation();
                        e.preventDefault();
                        ctx.onUpdate?.("");
                    }
                }) : null
            ]
        }
    })
}


export const DateTimeField = defineFieldType({
    name: 'datetime',
    class: 'of-datetime-field',
    setup: fieldSetup('datetime'),
})

export const DateField = defineFieldType({
    name: 'date',
    class: 'of-datetime-field',
    setup: fieldSetup('date'),
})

export const TimeField = defineFieldType({
    name: 'time',
    class: 'of-time-field',
    setup: fieldSetup('time'),
})

