import triangleVert from './shaders/triangle.vert.wgsl?raw'
import redFrag from './shaders/red.frag.wgsl?raw'

export async function initPipeline(device: GPUDevice, format: GPUTextureFormat): Promise<GPURenderPipeline> {
  const descriptor: GPURenderPipelineDescriptor = {
    vertex: {
      module: device.createShaderModule({
        code: triangleVert,
      }),
      entryPoint: 'main',
    },
    primitive: {
      topology: 'triangle-list', // try point-list, line-list, line-strip, triangle-strip?
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
