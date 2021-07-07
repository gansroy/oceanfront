const validTypes = [
    'text', 'currency', 'link'
]

function validateType(type: string): boolean {
    return validTypes.indexOf(type) >= 0
}

export default {
  currency: {
    symbol: {
      type: String,
      default: "",
    }
  },
  link: {
    href: {
      type: String,
      //default: null,
    },
    to: {
      type: String,
      default: '',
    }
  },
  common: {
    value: {
      type: [Number, String],
      default: "",
    },
    type: {
      type: String,
      validator: validateType,
    },
    align: {
      type: String,
      default: "start",
    },
    data: {
      type: Object,
      default: {}
    }
  }
}