import { createClient } from '@supabase/supabase-js'

// Verificação segura das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Criar cliente apenas se as variáveis estiverem disponíveis
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

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

// Função para verificar se o Supabase está configurado
const isSupabaseConfigured = () => {
  return supabase !== null && supabaseUrl && supabaseAnonKey
}

// Funções do banco de dados com fallback
export const getProperties = async (): Promise<Property[]> => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase não configurado, usando dados mock')
    return []
  }

  try {
    const { data, error } = await supabase!
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
  if (!isSupabaseConfigured()) {
    console.log('Supabase não configurado, simulando criação de propriedade')
    return {
      id: Date.now(),
      ...propertyData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  try {
    // Criar tabela se não existir
    await createTablesIfNotExists()

    const { data, error } = await supabase!
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
  if (!isSupabaseConfigured()) {
    console.log('Supabase não configurado, simulando atualização de propriedade')
    return {
      id,
      title: '',
      description: '',
      price: 0,
      location: '',
      type: '',
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      active: true,
      available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...propertyData
    } as Property
  }

  try {
    const { data, error } = await supabase!
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
  if (!isSupabaseConfigured()) {
    console.log('Supabase não configurado, simulando exclusão de propriedade')
    return true
  }

  try {
    const { error } = await supabase!
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
  if (!isSupabaseConfigured()) {
    console.log('Supabase não configurado, simulando criação de contato')
    return {
      id: Date.now(),
      ...contactData,
      created_at: new Date().toISOString()
    }
  }

  try {
    // Criar tabela se não existir
    await createTablesIfNotExists()

    const { data, error } = await supabase!
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

// Função para criar tabelas automaticamente
const createTablesIfNotExists = async () => {
  if (!isSupabaseConfigured()) return

  try {
    // Criar tabela properties
    await supabase!.rpc('create_properties_table', {})
  } catch (error) {
    // Ignorar erro se a tabela já existir
    console.log('Tabela properties pode já existir')
  }

  try {
    // Criar tabela contacts
    await supabase!.rpc('create_contacts_table', {})
  } catch (error) {
    // Ignorar erro se a tabela já existir
    console.log('Tabela contacts pode já existir')
  }
}