import { supabase } from './supabase'
import { Property, Contact, PropertyFilters } from './types'

// Funções para Propriedades
export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  let query = supabase
    .from('properties')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (filters?.type) {
    query = query.eq('type', filters.type)
  }
  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice)
  }
  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters?.bedrooms) {
    query = query.gte('bedrooms', filters.bedrooms)
  }
  if (filters?.bathrooms) {
    query = query.gte('bathrooms', filters.bathrooms)
  }

  const { data, error } = await query
  if (error) throw error
  
  // Adaptar dados para o formato esperado pelo frontend
  const adaptedData = (data || []).map(property => ({
    ...property,
    images: property.image ? [property.image] : [],
    features: ['Garagem', 'Quintal', 'Área de serviço'], // Features padrão
    available: property.active
  }))
  
  return adaptedData
}

export async function getPropertyById(id: number): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  
  if (data) {
    return {
      ...data,
      images: data.image ? [data.image] : [],
      features: ['Garagem', 'Quintal', 'Área de serviço'],
      available: data.active
    }
  }
  
  return null
}

export async function createProperty(property: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> {
  const propertyData = {
    title: property.title,
    description: property.description,
    price: property.price,
    location: property.location,
    type: property.type,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    image: property.images?.[0] || property.image || '',
    active: true
  }

  const { data, error } = await supabase
    .from('properties')
    .insert([propertyData])
    .select()
    .single()

  if (error) throw error
  
  return {
    ...data,
    images: data.image ? [data.image] : [],
    features: property.features || ['Garagem', 'Quintal', 'Área de serviço'],
    available: data.active
  }
}

export async function updateProperty(id: number, updates: Partial<Property>): Promise<Property> {
  const updateData: any = {
    updated_at: new Date().toISOString()
  }
  
  if (updates.title) updateData.title = updates.title
  if (updates.description) updateData.description = updates.description
  if (updates.price) updateData.price = updates.price
  if (updates.location) updateData.location = updates.location
  if (updates.type) updateData.type = updates.type
  if (updates.bedrooms) updateData.bedrooms = updates.bedrooms
  if (updates.bathrooms) updateData.bathrooms = updates.bathrooms
  if (updates.area) updateData.area = updates.area
  if (updates.images && updates.images.length > 0) updateData.image = updates.images[0]
  if (updates.available !== undefined) updateData.active = updates.available

  const { data, error } = await supabase
    .from('properties')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  
  return {
    ...data,
    images: data.image ? [data.image] : [],
    features: updates.features || ['Garagem', 'Quintal', 'Área de serviço'],
    available: data.active
  }
}

export async function deleteProperty(id: number): Promise<void> {
  // Soft delete - marcar como inativo
  const { error } = await supabase
    .from('properties')
    .update({ active: false })
    .eq('id', id)

  if (error) throw error
}

// Funções para Contatos
export async function createContact(contact: Omit<Contact, 'id' | 'created_at'>): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Função para autenticação admin
export async function authenticateAdmin(username: string, password: string): Promise<boolean> {
  // Para simplicidade, vamos usar credenciais hardcoded
  // Em produção, isso deveria ser hash no banco
  return username === 'admin' && password === 'batman267'
}