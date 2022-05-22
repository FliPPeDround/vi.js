import 'console-next'
import { initPipeline } from './initPipeline'

interface Size {
  width: number
  height: number
}

export default class Vi {
  adapter: GPUAdapter | null = null
  device: GPUDevice | null = null
  context: GPUCanvasContext | null = null
  format: GPUTextureFormat = 'rgba8unorm'
  size: Size = {
    width: 0,
    height: 0,
  }

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
    this.adapter = await navigator.gpu.requestAdapter()
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
    this.context = canvas.getContext('webgpu')
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
  }

  async draw() {
    const commandEncoder = this.device!.createCommandEncoder()
    const view = this.context!.getCurrentTexture().createView()
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view,
          clearValue: { r: 0, g: 0, b: 0, a: 1.0 },
          loadOp: 'clear', // clear/load
          storeOp: 'store', // store/discard
        },
      ],
    }
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
    passEncoder.setPipeline(await initPipeline(this.device!, this.format))
    // 3 vertex form a triangle
    passEncoder.draw(3)
    passEncoder.end()
    // webgpu run in a separate process, all the commands will be executed after submit
    this.device!.queue.submit([commandEncoder.finish()])
  }
}

