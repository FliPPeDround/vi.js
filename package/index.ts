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
  }

  async initwebGPU() {
    if (!navigator.gpu)
      this.throwGPUError()
    this.adapter = await navigator.gpu.requestAdapter()
    if (!this.adapter)
      this.throwGPUError()
    this.device = await this.adapter!.requestDevice()
  }

  async mount(selectors: string) {
    await this.initwebGPU()
    if (!selectors)
      this.throwCanvasError()
    const canvas = document.querySelector(selectors) as HTMLCanvasElement
    if (!canvas)
      this.throwCanvasError()
    this.context = canvas.getContext('webgpu')
    if (!this.context)
      this.throwGPUError()

    this.format = navigator.gpu.getPreferredCanvasFormat()
    this.size = {
      width: canvas.width,
      height: canvas.height,
    }

    this.context!.configure({
      device: this.device!,
      format: this.format,
      size: this.size,
      compositingAlphaMode: 'opaque',
    })
  }

  throwGPUError() {
    alert('WebGPU is not supported')
    throw new Error('WebGPU is not supported')
  }

  throwCanvasError() {
    alert('Canvas is not found')
    throw new Error('Canvas is not found')
  }
}

