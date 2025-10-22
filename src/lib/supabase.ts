import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
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
  image?: string
  images?: string[]
  features?: string[]
  active: boolean
  available: boolean
  created_at: string
  updated_at: string
}

export interface Contact {
  id?: number
  name: string
  email: string
  phone: string
  message: string
  property_id?: number
  created_at?: string
}

// Funções do banco de dados
export const getProperties = async (): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar propriedades:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Erro na função getProperties:', error)
    return []
  }
}

export const createProperty = async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property | null> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .insert([{
        ...propertyData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar propriedade:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erro na função createProperty:', error)
    throw error
  }
}

export const updateProperty = async (id: number, propertyData: Partial<Property>): Promise<Property | null> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update({
        ...propertyData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar propriedade:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erro na função updateProperty:', error)
    throw error
  }
}

export const deleteProperty = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar propriedade:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Erro na função deleteProperty:', error)
    throw error
  }
}

export const createContact = async (contactData: Omit<Contact, 'id' | 'created_at'>): Promise<Contact | null> => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        ...contactData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar contato:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Erro na função createContact:', error)
    throw error
  }
}