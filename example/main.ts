import { Triangle, Vi } from '../package/index'

const vi = new Vi()
await vi.mount('canvas')
vi.config.color = '#FFF123'

const triangle = new Triangle({
  color: 'rgb(0,0,255)',
})

window.addEventListener('resize', () => {
  triangle.config.color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`
})
