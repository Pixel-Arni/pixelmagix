import { afterEach, describe, it, expect, vi } from 'vitest'
import { formatBytes, formatRelativeTime, generateId } from './utils'

describe('formatBytes', () => {
  it('formats bytes to human readable string', () => {
    expect(formatBytes(0)).toBe('0 Bytes')
    expect(formatBytes(1024)).toBe('1 KB')
    expect(formatBytes(1024 * 1024)).toBe('1 MB')
    expect(formatBytes(10 * 1024 * 1024)).toBe('10 MB')
  })
})


describe('generateId', () => {
  it('generates ids with the correct length', () => {
    expect(generateId().length).toBe(8)
    expect(generateId(16).length).toBe(16)
  })

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => generateId()))
    expect(ids.size).toBe(1000)
  })
})
describe('formatRelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  function mockNow(date: Date) {
    vi.useFakeTimers()
    vi.setSystemTime(date)
  }

  it('returns "gerade eben" for less than a minute difference', () => {
    const now = new Date('2023-01-01T00:00:00Z')
    mockNow(now)
    expect(formatRelativeTime(now.getTime() - 30 * 1000)).toBe('gerade eben')
  })

  it('returns minutes for differences under an hour', () => {
    const now = new Date('2023-01-01T00:00:00Z')
    mockNow(now)
    expect(formatRelativeTime(now.getTime() - 5 * 60 * 1000)).toBe('vor 5 Minuten')
  })

  it('returns hours for differences under a day', () => {
    const now = new Date('2023-01-01T12:00:00Z')
    mockNow(now)
    expect(formatRelativeTime(now.getTime() - 2 * 60 * 60 * 1000)).toBe('vor 2 Stunden')
  })
})
