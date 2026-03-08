export type ShopItemCategory = 'ball' | 'celebration' | 'theme'

export interface ShopItem {
  id: string
  name: string
  category: ShopItemCategory
  price: number
  color?: string
  description: string
}

export const SHOP_CATALOG: ShopItem[] = [
  // Ball colors (10 coins each)
  { id: 'ball-red', name: 'Red Ball', category: 'ball', price: 10, color: '#E74C3C', description: 'A fiery red ball' },
  { id: 'ball-blue', name: 'Blue Ball', category: 'ball', price: 10, color: '#3498DB', description: 'A cool blue ball' },
  { id: 'ball-gold', name: 'Gold Ball', category: 'ball', price: 10, color: '#FFD700', description: 'A shiny gold ball' },
  { id: 'ball-rainbow', name: 'Rainbow Ball', category: 'ball', price: 10, color: '#FF69B4', description: 'A colorful rainbow ball' },
  { id: 'ball-galaxy', name: 'Galaxy Ball', category: 'ball', price: 10, color: '#6B3FA0', description: 'A deep space purple ball' },

  // Celebrations (15 coins each)
  { id: 'celeb-stars', name: 'Star Burst', category: 'celebration', price: 15, description: 'Star-shaped confetti on scores' },
  { id: 'celeb-fireworks', name: 'Fireworks', category: 'celebration', price: 15, description: 'Fireworks explosion on big scores' },
  { id: 'celeb-sparkle', name: 'Sparkle Trail', category: 'celebration', price: 15, description: 'Sparkle effects trail behind balls' },

  // Themes (25 coins each)
  { id: 'theme-neon', name: 'Neon Glow', category: 'theme', price: 25, color: '#00FF88', description: 'Neon green glow effects' },
  { id: 'theme-sunset', name: 'Sunset', category: 'theme', price: 25, color: '#FF6347', description: 'Warm sunset color scheme' },
  { id: 'theme-ocean', name: 'Ocean', category: 'theme', price: 25, color: '#1E90FF', description: 'Deep ocean blue theme' },
]

export function getItemById(id: string): ShopItem | undefined {
  return SHOP_CATALOG.find((item) => item.id === id)
}

export function getItemsByCategory(category: ShopItemCategory): ShopItem[] {
  return SHOP_CATALOG.filter((item) => item.category === category)
}
