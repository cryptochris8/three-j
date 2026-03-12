import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { LEGACY_SKIN_MAP } from '@/core/constants'
import type { CatalogEntry } from '@/ui/AvatarPicker'

const CATALOG_PATH = resolve(__dirname, '../../public/avatar-catalog.json')

function loadCatalog(): CatalogEntry[] {
  return JSON.parse(readFileSync(CATALOG_PATH, 'utf8'))
}

describe('avatar-catalog.json', () => {
  const catalog = loadCatalog()

  it('has 3000 entries', () => {
    expect(catalog).toHaveLength(3000)
  })

  it('entries have required fields', () => {
    for (const entry of catalog) {
      expect(entry).toHaveProperty('id')
      expect(entry).toHaveProperty('sport')
      expect(entry).toHaveProperty('name')
      expect(typeof entry.id).toBe('number')
      expect(typeof entry.sport).toBe('string')
      expect(typeof entry.name).toBe('string')
    }
  })

  it('IDs range from 1 to 3000', () => {
    const ids = catalog.map((e) => e.id).sort((a, b) => a - b)
    expect(ids[0]).toBe(1)
    expect(ids[ids.length - 1]).toBe(3000)
    expect(new Set(ids).size).toBe(3000)
  })

  it('is sorted by id', () => {
    for (let i = 1; i < catalog.length; i++) {
      expect(catalog[i].id).toBeGreaterThan(catalog[i - 1].id)
    }
  })

  it('has valid sport values', () => {
    const validSports = new Set(['soccer', 'basketball', 'football', 'golf', 'tennis', 'rugby', 'baseball', 'other'])
    for (const entry of catalog) {
      expect(validSports.has(entry.sport)).toBe(true)
    }
  })

  it('has entries for each main sport', () => {
    const sports = new Set(catalog.map((e) => e.sport))
    expect(sports.has('soccer')).toBe(true)
    expect(sports.has('basketball')).toBe(true)
    expect(sports.has('football')).toBe(true)
    expect(sports.has('golf')).toBe(true)
    expect(sports.has('tennis')).toBe(true)
    expect(sports.has('rugby')).toBe(true)
    expect(sports.has('baseball')).toBe(true)
  })

  it('all legacy skin map edition IDs exist in catalog', () => {
    const ids = new Set(catalog.map((e) => e.id))
    for (const edition of Object.values(LEGACY_SKIN_MAP)) {
      expect(ids.has(edition)).toBe(true)
    }
  })
})
