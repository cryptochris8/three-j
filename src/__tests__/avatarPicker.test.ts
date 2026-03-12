import { describe, it, expect } from 'vitest'
import { paginateCatalog, filterBySport, type CatalogEntry } from '@/ui/AvatarPicker'
import { LEGACY_SKIN_MAP } from '@/core/constants'

function makeCatalog(count: number, sport = 'soccer'): CatalogEntry[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    sport,
    name: `Avatar #${i + 1}`,
  }))
}

function makeMixedCatalog(): CatalogEntry[] {
  const sports = ['soccer', 'basketball', 'football', 'golf', 'tennis', 'rugby', 'baseball']
  return Array.from({ length: 70 }, (_, i) => ({
    id: i + 1,
    sport: sports[i % sports.length],
    name: `Avatar #${i + 1}`,
  }))
}

describe('paginateCatalog', () => {
  it('returns correct number of pages for 100 items', () => {
    const items = makeCatalog(100)
    const { totalPages } = paginateCatalog(items, 0)
    expect(totalPages).toBe(5) // 100 / 24 = 4.17 → ceil = 5
  })

  it('returns 24 items on first page', () => {
    const items = makeCatalog(100)
    const { pageItems } = paginateCatalog(items, 0)
    expect(pageItems).toHaveLength(24)
    expect(pageItems[0].id).toBe(1)
    expect(pageItems[23].id).toBe(24)
  })

  it('returns remaining items on last page', () => {
    const items = makeCatalog(50)
    // 50 items → 3 pages (24, 24, 2)
    const { pageItems, totalPages } = paginateCatalog(items, 2)
    expect(totalPages).toBe(3)
    expect(pageItems).toHaveLength(2)
    expect(pageItems[0].id).toBe(49)
    expect(pageItems[1].id).toBe(50)
  })

  it('clamps page to valid range', () => {
    const items = makeCatalog(10)
    const { pageItems, totalPages } = paginateCatalog(items, 999)
    expect(totalPages).toBe(1)
    expect(pageItems).toHaveLength(10)
  })

  it('handles empty catalog', () => {
    const { pageItems, totalPages } = paginateCatalog([], 0)
    expect(totalPages).toBe(1)
    expect(pageItems).toHaveLength(0)
  })

  it('handles exactly 24 items (one full page)', () => {
    const items = makeCatalog(24)
    const { pageItems, totalPages } = paginateCatalog(items, 0)
    expect(totalPages).toBe(1)
    expect(pageItems).toHaveLength(24)
  })
})

describe('filterBySport', () => {
  const mixed = makeMixedCatalog()

  it('returns all items when sport is "all"', () => {
    const result = filterBySport(mixed, 'all')
    expect(result).toHaveLength(mixed.length)
  })

  it('filters to only soccer entries', () => {
    const result = filterBySport(mixed, 'soccer')
    expect(result.every((e) => e.sport === 'soccer')).toBe(true)
    expect(result.length).toBe(10) // 70 items / 7 sports = 10 each
  })

  it('filters to only basketball entries', () => {
    const result = filterBySport(mixed, 'basketball')
    expect(result.every((e) => e.sport === 'basketball')).toBe(true)
    expect(result.length).toBe(10)
  })

  it('returns empty array for sport with no entries', () => {
    const soccerOnly = makeCatalog(10, 'soccer')
    const result = filterBySport(soccerOnly, 'golf')
    expect(result).toHaveLength(0)
  })
})

describe('LEGACY_SKIN_MAP', () => {
  it('maps all 10 legacy IDs', () => {
    expect(Object.keys(LEGACY_SKIN_MAP)).toHaveLength(10)
  })

  it('maps skinId 1 to edition 1', () => {
    expect(LEGACY_SKIN_MAP[1]).toBe(1)
  })

  it('maps skinId 10 to edition 3000', () => {
    expect(LEGACY_SKIN_MAP[10]).toBe(3000)
  })

  it('all mapped edition numbers are in 1-3000 range', () => {
    for (const edition of Object.values(LEGACY_SKIN_MAP)) {
      expect(edition).toBeGreaterThanOrEqual(1)
      expect(edition).toBeLessThanOrEqual(3000)
    }
  })

  it('all mapped edition numbers are unique', () => {
    const values = Object.values(LEGACY_SKIN_MAP)
    expect(new Set(values).size).toBe(values.length)
  })
})
