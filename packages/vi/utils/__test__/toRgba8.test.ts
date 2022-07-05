import { describe, expect, it } from 'vitest'
import { toRgba8 } from '../toRgba8'

describe('toRgba8', () => {
  it('hex', () => {
    expect(toRgba8('#ff0000')).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 0,
        "g": 0,
        "r": 1,
      }
    `)
  })
  it('hexXX', () => {
    expect(toRgba8('#ff0000ff')).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 0,
        "g": 0,
        "r": 1,
      }
    `)
  })
  it('rgb255', () => {
    expect(toRgba8('rgb(255,0,0)')).toMatchInlineSnapshot(`
      {
        "a": 1,
        "b": 0,
        "g": 0,
        "r": 1,
      }
    `)
  })
  it('rgba255', () => {
    expect(toRgba8('rgba(255,0,0,0.5)')).toMatchInlineSnapshot(`
      {
        "a": 0.5,
        "b": 0,
        "g": 0,
        "r": 1,
      }
    `)
  })
})
