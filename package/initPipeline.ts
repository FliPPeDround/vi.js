import triangleVert from './shaders/triangle.vert.wgsl?raw'
import redFrag from './shaders/red.frag.wgsl?raw'

interface TriangleConfig {
  color: string
}
export async function initPipeline(
  device: GPUDevice,
  format: GPUTextureFormat,
  triangleConfig: TriangleConfig,
): Promise<GPURenderPipeline> {
  console.log(triangleConfig)

  const descriptor: GPURenderPipelineDescriptor = {
    vertex: {
      module: device.createShaderModule({
        code: triangleVert,
      }),
      entryPoint: 'main',
    },
    primitive: {
      topology: 'triangle-list',
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
    layout: 'auto',
  }
  return await device.createRenderPipelineAsync(descriptor)
}
