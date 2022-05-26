import { Triangle, Vi } from './../package/index'

const vi = new Vi()
await vi.mount('canvas')
vi.config.color = '#FFF123'
const triangle = new Triangle({
  color: '#FFF',
})
const pipelineConfig = await triangle.initPipeline()
vi.add(pipelineConfig)
