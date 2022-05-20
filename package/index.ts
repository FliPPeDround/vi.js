import 'console-next'

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
        content: 'v0.0.1',
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

  draw(
    pipeline: GPURenderPipeline,
    vertexObj: any,
    colorObj: any,
  ) {
    if (!this.device)
      throw new Error('WebGPU is not supported')
    if (!this.context)
      throw new Error('canvas is not found')
    const encoder = this.device.createCommandEncoder()
    const renderPass = encoder.beginRenderPass({
      colorAttachments: [{
        view: this.context.getCurrentTexture().createView(),
        loadOp: 'clear',
        storeOp: 'store',
        clearValue: { r: 1, g: 1, b: 1, a: 1 },
      }],
    })
    renderPass.setPipeline(pipeline)
    renderPass.setVertexBuffer(0, vertexObj.vertexBuffer)
    renderPass.setBindGroup(0, colorObj.group)
    renderPass.draw(vertexObj.vertexCount)
    renderPass.end()

    const vertexBuffer = encoder.finish()
    this.device.queue.submit([vertexBuffer])
  }
}

