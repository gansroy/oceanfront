import {
  defineComponent,
  nextTick,
  onMounted,
  ref,
  watch,
  h
} from "vue";

import {
  DragEventOptions,
  triggerDragEvent
} from '../lib/colorpicker'

export default defineComponent({
  name: "Hue",
  props: {
    hue: {
      type: Number,
      default: 0,
      validator: (value: number) => {
        return value >= 0 && value <= 360;
      }
    }
  },
  emits: ["update:hue", "change"],
  setup(props, { emit }) {
    const bar = ref<HTMLElement | null>(null);
    const barHandle = ref<HTMLElement | null>(null);
    const handleLeft = ref(0);
    const handleTop = ref(0);
    const currentHue = ref(props.hue);
    const getBarLeftPosition = () => {
     
      if (bar.value && barHandle.value) {
        const rect = bar.value?.getBoundingClientRect();

        if (currentHue.value === 360) {
          return rect.width - barHandle.value.offsetWidth / 2;
        }
        return (
          ((currentHue.value % 360) *
            (rect.width - barHandle.value.offsetWidth)) /
            360 +
          barHandle.value.offsetWidth / 2
        );
      }

      return 0;
    };

    const updatePosition = () => {
      handleLeft.value = getBarLeftPosition();
      handleTop.value = 0;
    };

    const handleDrag = (event: MouseEvent) => {
      if (bar.value && barHandle.value) {
        const rect = bar.value?.getBoundingClientRect();

        let left = event.clientX - rect.left;
        left = Math.min(left, rect.width - barHandle.value.offsetWidth / 2);
        left = Math.max(barHandle.value.offsetWidth / 2, left);

        currentHue.value = Math.round(((left - barHandle.value.offsetWidth / 2) / (rect.width - barHandle.value.offsetWidth)) * 360);

        emit("update:hue", currentHue.value);
        emit("change", currentHue.value);
      }
    };

    watch(
      () => props.hue,
      (hue: number) => {
        currentHue.value = hue;
      }
    );

    watch(
      () => currentHue.value,
      () => {
        updatePosition();
      }
    );

    onMounted(() => {
      nextTick(() => {
        const dragConfig: DragEventOptions = {
          drag: (event: Event) => {
            handleDrag(event as MouseEvent);
          },
          end: (event: Event) => {
            handleDrag(event as MouseEvent);
          }
        };
        if (bar.value && barHandle.value) {
          triggerDragEvent(bar.value, dragConfig);
          triggerDragEvent(barHandle.value, dragConfig);
        }
        updatePosition();
      });
    });

    return () => {
      return h('div', { 
        class: 'hue transparent',  
      }, 
        h('div', { 
          class: 'hue__inner',
          ref: bar,
        }, 
          h('div', {
            class: 'hue__inner-pointer',
            ref: barHandle,
            style: {
              left: handleLeft.value + 'px',
              top: handleTop.value + 'px'
            },
          },
            h('div', {
              class: "hue__inner-handle"
            })
          )
        ),
      )
    }
  }
});