export function toRgba8(color: string): GPUColor {
  const hexReg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/
  const rgbaReg = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
  if (rgbaReg.test(color)) {
    const [, r, g, b, a] = color.match(rgbaReg)!
    return {
      r: (parseInt(r, 10)) / 255,
      g: (parseInt(g, 10)) / 255,
      b: (parseInt(b, 10)) / 255,
      a: a ? parseFloat(a) : 1,
    }
  }
  else if (hexReg.test(color)) {
    if (color.length === 4) {
      let colorNew = '#'
      for (let i = 1; i < 4; i += 1)
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
      color = colorNew
    }
    const colorChange = []
    for (let i = 1; i < color.length - 1; i += 2)
      colorChange.push(parseInt(`0x${color.slice(i, i + 2)}`) / 255)
    return { r: colorChange[0], g: colorChange[1], b: colorChange[2], a: colorChange[3] ?? 1 }
  }
  else {
    throw new Error('Invalid color format')
  }
}
