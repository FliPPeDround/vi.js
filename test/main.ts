import Vi from './../package/index'

const vi = new Vi()
await vi.mount('canvas')
// await vi.triangle({
//   color: color.value,
// })
setTimeout(() => {
  vi.config.color = '#FFF123'
}, 1000)

setTimeout(() => {
  vi.config.color = '#FF1233'
}, 2000)

