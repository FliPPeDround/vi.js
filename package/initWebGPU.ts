/* eslint-disable import/no-mutable-exports */
/* eslint-disable prefer-const */
import 'console-next'
import { effect, reactive, ref } from '@vue/reactivity'
import { toRgba8 } from './utils/toRgba8'
import { pipelineConfig } from './store'
export let device: GPUDevice
export let format: GPUTextureFormat = 'rgba8unorm'

interface TriangleConfig {
  color: string
}

interface TriangleVertexInfo {
  vertex: Float32Array
  vertexBuffer: GPUBuffer
  vertexCount: number
}

interface PipelineConfig {
  pipeline: GPURenderPipeline
  vertexInfo: TriangleVertexInfo
  colorInfo: any
}

export class Vi {
  adapter?: GPUAdapter
  context?: GPUCanvasContext

  config: TriangleConfig = reactive({
    color: '#FFF',
  })

  constructor() {
  }

  async initwebGPU() {
    if (!navigator.gpu)
      throw new Error('WebGPU is not supported')
    this.adapter = (
      await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance',
      })
    )!
    if (!this.adapter)
      throw new Error('WebGPU is not supported')
    device = await this.adapter.requestDevice()
  }

  async mount(selectors: string) {
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

    await this.initwebGPU()

    if (!selectors)
      throw new Error('canvas is not found')
    const canvas = document.querySelector(selectors) as HTMLCanvasElement
    if (!canvas)
      throw new Error('canvas is not found')
    const devicePixelRatio = window.devicePixelRatio || 1
    const size = {
      width: canvas.clientWidth * devicePixelRatio,
      height: canvas.clientHeight * devicePixelRatio,
    }
    canvas.width = size.width
    canvas.height = size.height

    this.context = canvas.getContext('webgpu')!
    if (!this.context)
      throw new Error('WebGPU is not supported')
    format = navigator.gpu.getPreferredCanvasFormat()

    this.context.configure({
      device,
      format,
      compositingAlphaMode: 'opaque',
    })

    effect(() => {
      this.draw()
    })
  }

  draw() {
    const commandEncoder = device!.createCommandEncoder()
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
    if (pipelineConfig?.colorInfo) {
      passEncoder.setPipeline(<GPURenderPipeline>pipelineConfig.pipeline)
      passEncoder.setVertexBuffer(0, (<PipelineConfig>pipelineConfig).vertexInfo.vertexBuffer)
      passEncoder.setBindGroup(0, (<PipelineConfig>pipelineConfig).colorInfo.group)
      passEncoder.draw((<PipelineConfig>pipelineConfig).vertexInfo.vertexCount)
    }
    passEncoder.end()
    device!.queue.submit([commandEncoder.finish()])
  }

  // add(pipelineConfig: PipelineConfig) {
  //   this.draw(pipelineConfig)
  // }
}

export {
  effect,
  reactive,
  ref,
}
