import 'console-next'
// import type { Ref } from '@vue/reactivity'
import { effect, reactive, ref } from '@vue/reactivity'
// import { initPipeline } from './initPipeline'
import { toRgba8 } from './utils/toRgba8'

interface Size {
  width: number
  height: number
}

interface TriangleConfig {
  color: string
}

export default class Vi {
  adapter?: GPUAdapter
  device?: GPUDevice
  context?: GPUCanvasContext
  format: GPUTextureFormat = 'rgba8unorm'
  size: Size = {
    width: 0,
    height: 0,
  }

  config: TriangleConfig = reactive({
    color: '#FFF',
  })

  constructor() {
    // eslint-disable-next-line no-console
    console.color([
      {
        color: '#213547',
        content: 'Vi.js',
        backgroundColor: '#42d392',
      },
      {
        color: '#91c8e4',
        content: 'V0.0.1',
        backgroundColor: '#3a3a3a',
      },
    ])
  }

  async initwebGPU() {
    if (!navigator.gpu)
      throw new Error('WebGPU is not supported')
    this.adapter = (await navigator.gpu.requestAdapter())!
    if (!this.adapter)
      throw new Error('WebGPU is not supported')
    this.device = await this.adapter.requestDevice()
  }

  async mount(selectors: string) {
    await this.initwebGPU()
    if (!selectors)
      throw new Error('canvas is not found')
    const canvas = document.querySelector(selectors) as HTMLCanvasElement
    if (!canvas)
      throw new Error('canvas is not found')
    this.context = canvas.getContext('webgpu')!
    if (!this.context)
      throw new Error('WebGPU is not supported')
    this.format = navigator.gpu.getPreferredCanvasFormat()
    this.size = {
      width: canvas.width,
      height: canvas.height,
    }

    this.context.configure({
      device: this.device!,
      format: this.format,
      compositingAlphaMode: 'opaque',
    })

    effect(() => {
      this.draw()
    })
  }

  // async triangle(triangleConfig: TriangleConfig) {
  //   const pipeline = await initPipeline(this.device!, this.format, triangleConfig)
  //   this.draw(pipeline)
  // }

  async draw(pipeline?: GPURenderPipeline) {
    const commandEncoder = this.device!.createCommandEncoder()
    const view = this.context!.getCurrentTexture().createView()
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view,
          clearValue: toRgba8(this.config.color),
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    }
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
    if (pipeline) {
      passEncoder.setPipeline(pipeline)
      passEncoder.draw(3)
    }
    passEncoder.end()
    this.device!.queue.submit([commandEncoder.finish()])
  }
}

export {
  effect,
  reactive,
  ref,
}
