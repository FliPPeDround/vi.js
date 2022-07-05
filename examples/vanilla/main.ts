import { Vi } from 'vi'

const options = {
  config: {
    color: '#213547',
  },
}

const vi = new Vi(options)
await vi.mount('canvas')
// vi.config.color = '#FFF123'

// const triangle = new Triangle({
//   color: 'rgb(0,0,255)',
// })
options.config.color = '#FFF123'

// window.addEventListener('resize', () => {
//   triangle.config.color = `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`
// })
