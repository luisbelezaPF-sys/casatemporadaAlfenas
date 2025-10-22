export interface Property {
  id: number
  title: string
  description: string
  price: number
  location: string
  type: string
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  images?: string[]
  features?: string[]
  active: boolean
  available?: boolean
  created_at: string
  updated_at: string
}

export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  message: string
  property_id?: number
  created_at: string
}

export interface Admin {
  id: string
  username: string
  password_hash: string
  created_at: string
}

export interface PropertyFilters {
  type?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  bedrooms?: number
  bathrooms?: number
}