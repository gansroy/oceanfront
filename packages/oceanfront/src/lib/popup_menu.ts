import { ref } from 'vue'

export function usePopupMenu(): object {
  const menuShown = ref(false)
  const menuOuter = ref()
  const toggleMenu = (_evt?: MouseEvent) => {
    menuOuter.value = _evt?.target
    menuShown.value = !menuShown.value
  }

  return {
    toggleMenu, menuShown, menuOuter
  }
}
