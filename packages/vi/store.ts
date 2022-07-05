import { reactive } from '@vue/reactivity'

interface TriangleVertexInfo {
  vertex: Float32Array
  vertexBuffer: GPUBuffer
  vertexCount: number
}

interface PipelineConfig {
  pipeline?: GPURenderPipeline | null
  vertexInfo?: TriangleVertexInfo | null
  colorInfo?: any
}

export const pipelineConfig: PipelineConfig = reactive({
  pipeline: null,
  vertexInfo: null,
  colorInfo: null,
})
