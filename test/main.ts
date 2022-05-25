import Vi from './../package/index'

const vi = new Vi()
await vi.mount('canvas')
vi.config.color = '#FFF123'
vi.triangleConfig.color = '#000'
vi.triangle()

setTimeout(() => {
  vi.triangleConfig.color = '#FFaa23'
}, 1000)

