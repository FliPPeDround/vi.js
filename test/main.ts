import Vi, { reactive } from './../package/index'

const vi = new Vi()
await vi.mount('canvas')
const color = reactive({
  value: '#FFF',
})
vi.config = reactive({
  color: color.value,
})
await vi.triangle({
  color: color.value,
})

setTimeout(() => {
  color.value = '#000'
}, 1000)
