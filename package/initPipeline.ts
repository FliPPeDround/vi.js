import { reactive } from '@vue/reactivity'
import triangleVert from './shaders/triangle.vert.wgsl?raw'
import colorFrag from './shaders/color.frag.wgsl?raw'
import { toRgba8 } from './utils/toRgba8'

interface TriangleConfig {
  color: string
}
export async function initPipeline(
  device: GPUDevice,
  format: GPUTextureFormat,
  triangleConfig?: TriangleConfig,
) {
  const vertex = new Float32Array([
    0, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
  ])
  const vertexBuffer = device.createBuffer({
    size: 24,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  })
  device.queue.writeBuffer(vertexBuffer, 0, vertex)

  const color = new Float32Array(toRgba8(triangleConfig?.color ?? '#FFF', 'array') as Iterable<number>)
  const colorBuffer = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })
  device.queue.writeBuffer(colorBuffer, 0, color)

  const descriptor: GPURenderPipelineDescriptor = {
    vertex: {
      module: device.createShaderModule({
        code: triangleVert,
      }),
      entryPoint: 'main',
      buffers: [{
        arrayStride: 8,
        attributes: [{
          shaderLocation: 0,
          offset: 0,
          format: 'float32x2',
        }],
      }],
    },
    fragment: {
      module: device.createShaderModule({
        code: colorFrag,
      }),
      entryPoint: 'main',
      targets: [
        {
          format,
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
    },
    layout: 'auto',
  }

  const vertexInfo = {
    vertex,
    vertexBuffer,
    vertexCount: 3,
  }
  const pipeline = await device.createRenderPipelineAsync(descriptor)

  const group = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{
      binding: 0,
      resource: {
        buffer: colorBuffer,
      },
    }],
  })

  const colorInfo = reactive({
    color, colorBuffer, group,
  })
  return {
    pipeline,
    vertexInfo,
    colorInfo,
  }
}
