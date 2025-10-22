'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Phone, Mail, MapPin, Bed, Bath, Square, Star, Shield, Award, Users, Menu, X, Plus, Edit, Trash2, LogOut, Settings, Upload, Image as ImageIcon, MessageCircle } from 'lucide-react'
import { getProperties, createProperty, updateProperty, deleteProperty, createContact, Property, Contact } from '@/lib/supabase'

// Componentes UI básicos - usando apenas os que existem
const Button = ({ children, onClick, className = '', variant = 'default', size = 'default', disabled = false, type = 'button', ...props }: any) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background'
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  }
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3 rounded-md',
    lg: 'h-11 px-8 rounded-md'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const Input = ({ className = '', ...props }: any) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Textarea = ({ className = '', ...props }: any) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
)

const Card = ({ children, className = '', ...props }: any) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>
)

const CardContent = ({ children, className = '', ...props }: any) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
)

const CardHeader = ({ children, className = '', ...props }: any) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
)

const CardTitle = ({ children, className = '', ...props }: any) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
)

const Dialog = ({ children, open, onOpenChange }: any) => {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/80" onClick={() => onOpenChange(false)} />
      <div className="relative z-50 max-h-[85vh] w-full max-w-lg overflow-auto">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ children, className = '', ...props }: any) => (
  <div className={`relative rounded-lg border bg-background p-6 shadow-lg ${className}`} {...props}>
    {children}
  </div>
)

const DialogHeader = ({ children, className = '', ...props }: any) => (
  <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props}>
    {children}
  </div>
)

const DialogTitle = ({ children, className = '', ...props }: any) => (
  <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h2>
)

const Label = ({ children, className = '', ...props }: any) => (
  <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
    {children}
  </label>
)

const Select = ({ children, value, onValueChange }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue)
    setIsOpen(false)
  }
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
      >
        <span>{value || 'Selecione o tipo'}</span>
        <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-600 bg-gray-700 p-1 shadow-md">
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type === SelectContent) {
              return React.cloneElement(child, {
                ...child.props,
                children: React.Children.map(child.props.children, (item) => {
                  if (React.isValidElement(item) && item.type === SelectItem) {
                    return React.cloneElement(item, {
                      ...item.props,
                      onClick: () => handleSelect(item.props.value)
                    })
                  }
                  return item
                })
              })
            }
            return child
          })}
        </div>
      )}
    </div>
  )
}

const SelectTrigger = ({ children }: any) => children
const SelectValue = ({ placeholder }: any) => <span>{placeholder}</span>
const SelectContent = ({ children }: any) => children
const SelectItem = ({ children, value, onClick }: any) => (
  <div
    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-2 text-sm outline-none hover:bg-gray-600 hover:text-white transition-colors"
    onClick={onClick}
  >
    {children}
  </div>
)

const Badge = ({ children, className = '', variant = 'default' }: any) => {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'text-foreground border border-input'
  }
  
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  )
}

// Hook de autenticação simples
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const login = (username: string, password: string) => {
    if (username === 'admin' && password === 'batman267') {
      setIsAuthenticated(true)
      return true
    }
    return false
  }
  
  const logout = () => {
    setIsAuthenticated(false)
  }
  
  return { isAuthenticated, login, logout }
}

// Tipos
interface PropertyFilters {
  type?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
}

export default function RealEstateWebsite() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [showPropertyForm, setShowPropertyForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)

  const { isAuthenticated, login, logout } = useAuth()

  // Estados do formulário de contato
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  // Estados do formulário de propriedade
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    images: '',
    features: '',
    uploadedImages: [] as string[]
  })

  // Estados do login admin
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    loadProperties()
  }, [])

  useEffect(() => {
    filterProperties()
  }, [properties, filters, searchTerm])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const data = await getProperties()
      setProperties(data)
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error)
      // Dados mock para demonstração caso haja erro
      const mockProperties: Property[] = [
        {
          id: 1,
          title: 'Casa Moderna no Centro',
          description: 'Belíssima casa moderna localizada no centro de Alfenas, com acabamento de primeira qualidade.',
          price: 2500,
          location: 'Centro, Alfenas',
          type: 'Casa',
          bedrooms: 3,
          bathrooms: 2,
          area: 150,
          image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
          images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'],
          features: ['Garagem', 'Quintal', 'Área de serviço'],
          active: true,
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Apartamento Luxuoso',
          description: 'Apartamento de alto padrão com vista panorâmica da cidade.',
          price: 1800,
          location: 'Jardim Aeroporto, Alfenas',
          type: 'Apartamento',
          bedrooms: 2,
          bathrooms: 1,
          area: 80,
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
          images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
          features: ['Elevador', 'Portaria 24h', 'Piscina'],
          active: true,
          available: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setProperties(mockProperties)
    } finally {
      setLoading(false)
    }
  }

  const filterProperties = () => {
    let filtered = properties

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type)
    }

    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= filters.minPrice!)
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= filters.maxPrice!)
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= filters.bedrooms!)
    }

    setFilteredProperties(filtered)
  }

  // Função para upload de múltiplas imagens
  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return

    setUploadingImages(true)
    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          alert(`Arquivo ${file.name} não é uma imagem válida`)
          continue
        }

        // Validar tamanho (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert(`Arquivo ${file.name} é muito grande (máximo 5MB)`)
          continue
        }

        // Converter para base64 ou usar URL temporária
        const reader = new FileReader()
        const imageUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            resolve(e.target?.result as string)
          }
          reader.readAsDataURL(file)
        })

        uploadedUrls.push(imageUrl)
      }

      // Adicionar as novas imagens às existentes
      setPropertyForm(prev => ({
        ...prev,
        uploadedImages: [...prev.uploadedImages, ...uploadedUrls]
      }))

    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload das imagens')
    } finally {
      setUploadingImages(false)
    }
  }

  // Função para remover imagem
  const removeImage = (index: number) => {
    setPropertyForm(prev => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter((_, i) => i !== index)
    }))
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createContact({
        ...contactForm,
        property_id: selectedProperty?.id
      })
      
      // Enviar para WhatsApp
      const message = `Olá Raphael! Tenho interesse em um imóvel.
      
Nome: ${contactForm.name}
Email: ${contactForm.email}
Telefone: ${contactForm.phone}
${selectedProperty ? `Imóvel: ${selectedProperty.title}` : ''}

Mensagem: ${contactForm.message}`

      const whatsappUrl = `https://wa.me/5535988326287?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')

      setContactForm({ name: '', email: '', phone: '', message: '' })
      setShowContact(false)
      setSelectedProperty(null)
    } catch (error) {
      console.error('Erro ao enviar contato:', error)
    }
  }

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Combinar imagens de URL e imagens uploadadas
      const allImages = [
        ...propertyForm.images.split(',').map(img => img.trim()).filter(img => img),
        ...propertyForm.uploadedImages
      ]

      const propertyData = {
        title: propertyForm.title,
        description: propertyForm.description,
        price: parseFloat(propertyForm.price),
        location: propertyForm.location,
        type: propertyForm.type,
        bedrooms: parseInt(propertyForm.bedrooms),
        bathrooms: parseInt(propertyForm.bathrooms),
        area: parseFloat(propertyForm.area),
        image: allImages[0] || '',
        images: allImages,
        features: propertyForm.features.split(',').map(feature => feature.trim()).filter(feature => feature),
        active: true,
        available: true
      }

      if (editingProperty) {
        await updateProperty(editingProperty.id, propertyData)
      } else {
        await createProperty(propertyData)
      }

      // Recarregar propriedades para mostrar a nova na página inicial
      await loadProperties()
      
      setShowPropertyForm(false)
      setEditingProperty(null)
      setPropertyForm({
        title: '', description: '', price: '', location: '', type: '',
        bedrooms: '', bathrooms: '', area: '', images: '', features: '',
        uploadedImages: []
      })

      // Mostrar mensagem de sucesso
      alert(editingProperty ? 'Imóvel atualizado com sucesso!' : 'Imóvel adicionado com sucesso! Agora aparece na página inicial.')
      
    } catch (error) {
      console.error('Erro ao salvar propriedade:', error)
      alert('Erro ao salvar propriedade. Verifique os dados e tente novamente.')
    }
  }

  const handleDeleteProperty = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta propriedade?')) {
      try {
        await deleteProperty(id)
        await loadProperties()
        alert('Propriedade excluída com sucesso!')
      } catch (error) {
        console.error('Erro ao excluir propriedade:', error)
        alert('Erro ao excluir propriedade.')
      }
    }
  }

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property)
    setPropertyForm({
      title: property.title,
      description: property.description,
      price: property.price.toString(),
      location: property.location,
      type: property.type,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      area: property.area.toString(),
      images: property.images?.filter(img => img.startsWith('http')).join(', ') || '',
      features: property.features?.join(', ') || '',
      uploadedImages: property.images?.filter(img => img.startsWith('data:')) || []
    })
    setShowPropertyForm(true)
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(adminForm.username, adminForm.password)) {
      setShowAdmin(false)
      setAdminForm({ username: '', password: '' })
    } else {
      alert('Credenciais inválidas!')
    }
  }

  // Função para abrir WhatsApp diretamente
  const openWhatsApp = () => {
    const message = `Olá Raphael! Gostaria de mais informações sobre os imóveis disponíveis.`
    const whatsappUrl = `https://wa.me/5535988326287?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Botão WhatsApp Flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={openWhatsApp}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-2xl hover:scale-110 transition-all duration-300"
          size="sm"
        >
          <MessageCircle className="w-7 h-7 text-white" />
        </Button>
      </div>

      {/* Header */}
      <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo e Foto do Corretor */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 flex items-center justify-center">
                <span className="text-black font-bold text-lg">R</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
                  Raphael Augusto
                </h1>
                <p className="text-sm text-gray-400">Corretor de Imóveis</p>
              </div>
            </div>

            {/* Ícone Admin Visível - Posição de Destaque */}
            <div className="flex items-center space-x-4">
              {/* Navigation Desktop */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#home" className="text-gray-300 hover:text-amber-400 transition-colors">Início</a>
                <a href="#about" className="text-gray-300 hover:text-amber-400 transition-colors">Sobre</a>
                <a href="#properties" className="text-gray-300 hover:text-amber-400 transition-colors">Imóveis</a>
                <a href="#contact" className="text-gray-300 hover:text-amber-400 transition-colors">Contato</a>
              </nav>

              {/* Ícone Admin - SEMPRE VISÍVEL */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setShowPropertyForm(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-black"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    <span className="hidden sm:inline">Adicionar</span>
                  </Button>
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAdmin(true)}
                  className="bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold shadow-lg"
                  size="sm"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Painel Admin</span>
                  <span className="sm:hidden">Admin</span>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-300 hover:text-amber-400 transition-colors">Início</a>
                <a href="#about" className="text-gray-300 hover:text-amber-400 transition-colors">Sobre</a>
                <a href="#properties" className="text-gray-300 hover:text-amber-400 transition-colors">Imóveis</a>
                <a href="#contact" className="text-gray-300 hover:text-amber-400 transition-colors">Contato</a>
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => setShowPropertyForm(true)}
                      className="bg-amber-600 hover:bg-amber-700 text-black w-full"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar Imóvel
                    </Button>
                    <Button
                      onClick={logout}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 w-full"
                    >
                      <LogOut className="w-4 h-4 mr-1" />
                      Sair
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setShowAdmin(true)}
                    className="bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold w-full"
                    size="sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Painel Admin
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Lado Esquerdo - Imagem Adicionada */}
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/36fdab3e-5f9b-408d-9062-956ffefa01ca.jpg"
                  alt="Raphael Augusto - Corretor de Imóveis"
                  className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              </div>
            </div>

            {/* Lado Direito - Conteúdo */}
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">
                  Encontre sua casa temporada ideal
                </span>
                <br />
                <span className="text-white">para seus momentos de diversão</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl">
                Com mais de 10 anos de experiência no mercado imobiliário de Alfenas, 
                oferecemos as melhores oportunidades de locação com total transparência e confiança.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold px-8 py-3 text-lg"
                >
                  Ver Imóveis
                </Button>
                <Button 
                  onClick={() => setShowContact(true)}
                  variant="outline" 
                  className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black px-8 py-3 text-lg"
                >
                  Entrar em Contato
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">
                Sobre <span className="bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">Raphael Augusto</span>
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Raphael Augusto de Lima Barbosa é um corretor centrado, ético e experiente, 
                que contribuiu para a ascensão do mercado imobiliário em Alfenas.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Com uma abordagem personalizada e foco na satisfação do cliente, 
                Raphael oferece consultoria completa em locação de imóveis, 
                garantindo transparência em todas as negociações e suporte total 
                durante todo o processo.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">Ética</h3>
                  <p className="text-sm text-gray-400">Transparência total</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">Experiência</h3>
                  <p className="text-sm text-gray-400">10+ anos no mercado</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">Confiança</h3>
                  <p className="text-sm text-gray-400">Clientes satisfeitos</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-r from-amber-400/20 to-yellow-600/20 rounded-2xl flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-4xl">R</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Imóveis para <span className="bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">Locação</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Descubra nossa seleção exclusiva de imóveis em Alfenas, 
              cuidadosamente escolhidos para atender suas necessidades.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por título, localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>

            {showFilters && (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-gray-300">Tipo</Label>
                      <Select value={filters.type || ''} onValueChange={(value) => setFilters({...filters, type: value || undefined})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos</SelectItem>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Apartamento">Apartamento</SelectItem>
                          <SelectItem value="Kitnet">Kitnet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-300">Preço Mínimo</Label>
                      <Input
                        type="number"
                        placeholder="R$ 0"
                        value={filters.minPrice || ''}
                        onChange={(e) => setFilters({...filters, minPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Preço Máximo</Label>
                      <Input
                        type="number"
                        placeholder="R$ 10000"
                        value={filters.maxPrice || ''}
                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Quartos</Label>
                      <Select value={filters.bedrooms?.toString() || ''} onValueChange={(value) => setFilters({...filters, bedrooms: value ? parseInt(value) : undefined})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Qualquer" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Qualquer</SelectItem>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Properties Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto"></div>
              <p className="text-gray-400 mt-4">Carregando imóveis...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="bg-gray-800 border-gray-700 hover:border-amber-400 transition-all duration-300 group overflow-hidden">
                  <div className="relative">
                    <img
                      src={property.images?.[0] || property.image || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'}
                      alt={property.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-amber-600 text-black font-semibold">
                        {property.type}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        R$ {property.price.toLocaleString('pt-BR')}/mês
                      </Badge>
                    </div>
                    {isAuthenticated && (
                      <div className="absolute bottom-4 right-4 flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditProperty(property)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDeleteProperty(property.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{property.title}</h3>
                    <p className="text-gray-400 mb-4 line-clamp-2">{property.description}</p>
                    
                    <div className="flex items-center text-gray-400 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="w-4 h-4 mr-1" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="w-4 h-4 mr-1" />
                        <span>{property.area}m²</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {(property.features || []).slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedProperty(property)}
                        className="flex-1 bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold"
                      >
                        Ver Detalhes
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedProperty(property)
                          setShowContact(true)
                        }}
                        variant="outline"
                        className="border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black"
                      >
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredProperties.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Nenhum imóvel encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Entre em <span className="bg-gradient-to-r from-amber-400 to-yellow-600 bg-clip-text text-transparent">Contato</span>
          </h2>
          <p className="text-lg text-gray-300 mb-12">
            Pronto para encontrar seu próximo lar? Entre em contato conosco hoje mesmo!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-semibold text-white mb-2">Telefone</h3>
              <p className="text-gray-400">(35) 98832-6287</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-semibold text-white mb-2">Email</h3>
              <p className="text-gray-400">raphael@corretor.com</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-black" />
              </div>
              <h3 className="font-semibold text-white mb-2">Localização</h3>
              <p className="text-gray-400">Alfenas, MG</p>
            </div>
          </div>

          <Button
            onClick={() => setShowContact(true)}
            className="bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold px-8 py-3 text-lg"
          >
            Enviar Mensagem
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 flex items-center justify-center">
              <span className="text-black font-bold">R</span>
            </div>
            <div>
              <h3 className="font-bold text-white">Raphael Augusto</h3>
              <p className="text-sm text-gray-400">Corretor de Imóveis</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-2">
            © 2024 Raphael Augusto de Lima Barbosa. Todos os direitos reservados.
          </p>
          <p className="text-gray-500 text-xs">
            Luís Felipe Olinto Alves produções
          </p>
        </div>
      </footer>

      {/* Property Details Modal */}
      <Dialog open={!!selectedProperty && !showContact} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 text-white">
          {selectedProperty && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  {selectedProperty.title}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProperty.images?.[0] || selectedProperty.image || 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'}
                    alt={selectedProperty.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="mt-4">
                    <h3 className="font-semibold text-white mb-2">Características</h3>
                    <div className="flex flex-wrap gap-2">
                      {(selectedProperty.features || []).map((feature, index) => (
                        <Badge key={index} variant="outline" className="border-gray-600 text-gray-300">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-amber-400 mb-2">
                      R$ {selectedProperty.price.toLocaleString('pt-BR')}/mês
                    </div>
                    <div className="flex items-center text-gray-400 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{selectedProperty.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                      <Bed className="w-6 h-6 mx-auto mb-1 text-amber-400" />
                      <div className="text-sm text-gray-400">Quartos</div>
                      <div className="font-semibold text-white">{selectedProperty.bedrooms}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                      <Bath className="w-6 h-6 mx-auto mb-1 text-amber-400" />
                      <div className="text-sm text-gray-400">Banheiros</div>
                      <div className="font-semibold text-white">{selectedProperty.bathrooms}</div>
                    </div>
                    <div className="text-center p-3 bg-gray-700 rounded-lg">
                      <Square className="w-6 h-6 mx-auto mb-1 text-amber-400" />
                      <div className="text-sm text-gray-400">Área</div>
                      <div className="font-semibold text-white">{selectedProperty.area}m²</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-white mb-2">Descrição</h3>
                    <p className="text-gray-300 leading-relaxed">{selectedProperty.description}</p>
                  </div>

                  <Button
                    onClick={() => setShowContact(true)}
                    className="w-full bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold"
                  >
                    Tenho Interesse
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Entre em Contato
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Nome</Label>
              <Input
                id="name"
                value={contactForm.name}
                onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">Telefone</Label>
              <Input
                id="phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-gray-300">Mensagem</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                required
                className="bg-gray-700 border-gray-600 text-white"
                rows={4}
              />
            </div>
            {selectedProperty && (
              <div className="p-3 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-400">Imóvel de interesse:</p>
                <p className="font-semibold text-white">{selectedProperty.title}</p>
              </div>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold"
            >
              Enviar via WhatsApp
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Admin Login Modal */}
      <Dialog open={showAdmin} onOpenChange={setShowAdmin}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Login Administrativo
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-300">Usuário</Label>
              <Input
                id="username"
                value={adminForm.username}
                onChange={(e) => setAdminForm({...adminForm, username: e.target.value})}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">Senha</Label>
              <Input
                id="password"
                type="password"
                value={adminForm.password}
                onChange={(e) => setAdminForm({...adminForm, password: e.target.value})}
                required
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold"
            >
              Entrar
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Property Form Modal - ATUALIZADO COM UPLOAD DE IMAGENS */}
      <Dialog open={showPropertyForm} onOpenChange={setShowPropertyForm}>
        <DialogContent className="max-w-4xl bg-gray-800 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {editingProperty ? 'Editar Imóvel' : 'Adicionar Novo Imóvel'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePropertySubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">Título</Label>
                <Input
                  id="title"
                  value={propertyForm.title}
                  onChange={(e) => setPropertyForm({...propertyForm, title: e.target.value})}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="price" className="text-gray-300">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  value={propertyForm.price}
                  onChange={(e) => setPropertyForm({...propertyForm, price: e.target.value})}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-gray-300">Descrição</Label>
              <Textarea
                id="description"
                value={propertyForm.description}
                onChange={(e) => setPropertyForm({...propertyForm, description: e.target.value})}
                required
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-gray-300">Localização</Label>
                <Input
                  id="location"
                  value={propertyForm.location}
                  onChange={(e) => setPropertyForm({...propertyForm, location: e.target.value})}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="type" className="text-gray-300">Tipo</Label>
                <Select value={propertyForm.type} onValueChange={(value) => setPropertyForm({...propertyForm, type: value})}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Kitnet">Kitnet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms" className="text-gray-300">Quartos</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  value={propertyForm.bedrooms}
                  onChange={(e) => setPropertyForm({...propertyForm, bedrooms: e.target.value})}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="bathrooms" className="text-gray-300">Banheiros</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  value={propertyForm.bathrooms}
                  onChange={(e) => setPropertyForm({...propertyForm, bathrooms: e.target.value})}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="area" className="text-gray-300">Área (m²)</Label>
                <Input
                  id="area"
                  type="number"
                  value={propertyForm.area}
                  onChange={(e) => setPropertyForm({...propertyForm, area: e.target.value})}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            {/* SEÇÃO DE UPLOAD DE IMAGENS - NOVA FUNCIONALIDADE */}
            <div className="space-y-4">
              <Label className="text-gray-300 text-lg font-semibold">Imagens do Imóvel</Label>
              
              {/* Upload de Arquivos */}
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div className="text-gray-300">
                    <span className="font-semibold text-amber-400">Clique para selecionar</span> ou arraste as imagens aqui
                  </div>
                  <div className="text-sm text-gray-500">
                    Suporta múltiplas imagens (JPG, PNG, GIF - máx. 5MB cada)
                  </div>
                </label>
              </div>

              {/* Loading de Upload */}
              {uploadingImages && (
                <div className="flex items-center justify-center space-x-2 text-amber-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-400"></div>
                  <span>Processando imagens...</span>
                </div>
              )}

              {/* Preview das Imagens Uploadadas */}
              {propertyForm.uploadedImages.length > 0 && (
                <div>
                  <Label className="text-gray-300 mb-2 block">Imagens Selecionadas ({propertyForm.uploadedImages.length})</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {propertyForm.uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-600"
                        />
                        <Button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-600 hover:bg-red-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          size="sm"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* URLs de Imagens (método alternativo) */}
              <div>
                <Label htmlFor="images" className="text-gray-300">URLs de Imagens (opcional - separadas por vírgula)</Label>
                <Textarea
                  id="images"
                  value={propertyForm.images}
                  onChange={(e) => setPropertyForm({...propertyForm, images: e.target.value})}
                  placeholder="https://exemplo.com/imagem1.jpg, https://exemplo.com/imagem2.jpg"
                  className="bg-gray-700 border-gray-600 text-white"
                  rows={2}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Você pode usar URLs de imagens OU fazer upload de arquivos (ou ambos)
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="features" className="text-gray-300">Características (separadas por vírgula)</Label>
              <Input
                id="features"
                value={propertyForm.features}
                onChange={(e) => setPropertyForm({...propertyForm, features: e.target.value})}
                placeholder="Garagem, Quintal, Área de serviço"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={uploadingImages}
                className="flex-1 bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-500 hover:to-yellow-700 text-black font-semibold disabled:opacity-50"
              >
                {uploadingImages ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    {editingProperty ? 'Atualizar' : 'Adicionar'} Imóvel
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPropertyForm(false)
                  setEditingProperty(null)
                  setPropertyForm({
                    title: '', description: '', price: '', location: '', type: '',
                    bedrooms: '', bathrooms: '', area: '', images: '', features: '',
                    uploadedImages: []
                  })
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}