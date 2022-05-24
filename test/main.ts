import Vi from './../package/index'

const vi = new Vi()
await vi.mount('canvas')
vi.config.color = '#FFF123'
await vi.triangle({
  color: '123',
})
// setTimeout(() => {
//   vi.config.color = '#FFF123'
// }, 1000)

// setTimeout(() => {
//   vi.config.color = '#FF2d2a'
// }, 2000)

