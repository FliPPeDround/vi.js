import triangleVert from './shaders/triangle.vert.wgsl?raw'
import redFrag from './shaders/red.frag.wgsl?raw'

interface TriangleConfig {
  color: string
}
export async function initPipeline(
  device: GPUDevice,
  format: GPUTextureFormat,
  _triangleConfig?: TriangleConfig,
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
        code: redFrag,
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

  return {
    pipeline,
    vertexInfo,
  }
}
