import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useAuth } from './auth-context'
import { toast } from 'sonner@2.0.3'
import { UserCircle, Building, GraduationCap, TreePine, Users, CheckCircle, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react'
import { HireTreeLogo } from './hire-tree-logo'

type UserRole = 'applicant' | 'company' | 'educational'

interface PortalCardProps {
  role: UserRole
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
}

function PortalCard({ role, title, description, icon, features }: PortalCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { login, register, connectWallet } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    try {
      const success = await login(email, password, role)
      if (success) {
        toast.success('¡Bienvenido!')
        setIsDialogOpen(false)
      } else {
        toast.error('Credenciales inválidas')
      }
    } catch (error) {
      toast.error('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (formData: FormData) => {
    setIsLoading(true)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    
    try {
      const success = await register(email, password, name, role)
      if (success) {
        toast.success('¡Cuenta creada exitosamente!')
        setIsDialogOpen(false)
      } else {
        toast.error('Error al crear la cuenta')
      }
    } catch (error) {
      toast.error('Error al registrarse')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletConnect = async () => {
    setIsLoading(true)
    try {
      const success = await connectWallet(role)
      if (success) {
        toast.success('¡Wallet conectada!')
        setIsDialogOpen(false)
      } else {
        toast.error('Error al conectar wallet')
      }
    } catch (error) {
      toast.error('Error al conectar wallet')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-green-300 hover:-translate-y-1 group bg-gradient-to-br from-white to-green-50/30">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-4 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white rounded-2xl w-20 h-20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800 flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-500" />
            Características principales:
          </h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="w-full bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Zap size={16} className="mr-2" />
              Ingresar / Registrarse
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Acceso - {title}</DialogTitle>
              <DialogDescription>
                Inicia sesión o regístrate para acceder al portal
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Registrarse</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleLogin(formData)
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      name="email" 
                      type="email" 
                      placeholder="tu@email.com"
                      defaultValue={role === 'applicant' ? 'candidate@example.com' : role === 'company' ? 'hr@techcorp.com' : 'admin@universidad.edu'}
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Contraseña</Label>
                    <Input 
                      id="login-password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••"
                      defaultValue="password"
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleRegister(formData)
                }} className="space-y-4">
                  <div>
                    <Label htmlFor="register-name">Nombre completo</Label>
                    <Input 
                      id="register-name" 
                      name="name" 
                      placeholder="Tu nombre completo"
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      name="email" 
                      type="email" 
                      placeholder="tu@email.com"
                      required 
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Contraseña</Label>
                    <Input 
                      id="register-password" 
                      name="password" 
                      type="password" 
                      placeholder="••••••••"
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">O</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleWalletConnect}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Conectando...' : '🦊 Conectar Wallet'}
            </Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

export function LandingPage() {
  const portals = [
    {
      role: 'applicant' as const,
      title: 'Postulante',
      description: 'Demuestra tus habilidades y obtén certificaciones digitales verificables',
      icon: <UserCircle size={32} />,
      features: [
        'Entrevistas inteligentes automatizadas',
        'Evaluación de habilidades blandas',
        'Credenciales digitales verificables',
        'Control de privacidad',
        'Perfil profesional certificado'
      ]
    },
    {
      role: 'company' as const,
      title: 'Empresa',
      description: 'Encuentra el talento perfecto con evaluaciones personalizadas e inteligentes',
      icon: <Building size={32} />,
      features: [
        'Gestión completa de vacantes',
        'Criterios de evaluación configurables',
        'Ranking automático de candidatos',
        'Verificación de credenciales',
        'Informes detallados de compatibilidad'
      ]
    },
    {
      role: 'educational' as const,
      title: 'Entidad Educacional',
      description: 'Monitorea el progreso de tus estudiantes y emite recomendaciones verificables',
      icon: <GraduationCap size={32} />,
      features: [
        'Seguimiento de cohortes estudiantiles',
        'Análisis de desarrollo de habilidades',
        'Cartas de recomendación digitales',
        'Certificaciones verificables',
        'Dashboard de métricas agregadas'
      ]
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 via-emerald-400/5 to-teal-400/5"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-4 h-4 bg-green-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-6 h-6 bg-emerald-400 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-3 h-3 bg-teal-400 rounded-full opacity-25 animate-pulse"></div>
          <div className="absolute bottom-40 right-10 w-5 h-5 bg-green-500 rounded-full opacity-20 animate-bounce"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            {/* Logo and Title */}
            <div className="mb-8">
              <HireTreeLogo size={80} className="justify-center mb-6" />
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="text-yellow-500 animate-pulse" size={20} />
                <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  Evaluación de Nueva Generación
                </span>
                <Sparkles className="text-yellow-500 animate-pulse" size={20} />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Donde el <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">talento florece</span> 
              <br />y las oportunidades crecen
            </h2>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-10 leading-relaxed">
              Revolucionamos la evaluación de talento con inteligencia artificial, credenciales digitales verificables 
              y un ecosistema que conecta a las personas perfectas con las oportunidades ideales.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">95%</div>
                <div className="text-sm text-gray-600">Precisión en evaluaciones</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-1">10K+</div>
                <div className="text-sm text-gray-600">Talentos certificados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-1">500+</div>
                <div className="text-sm text-gray-600">Empresas conectadas</div>
              </div>
            </div>
            
            {/* Features highlight */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Zap className="text-yellow-500" size={16} />
                <span className="text-sm font-medium text-gray-700">IA Conversacional</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <Shield className="text-blue-500" size={16} />
                <span className="text-sm font-medium text-gray-700">Credenciales Verificables</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <TrendingUp className="text-green-500" size={16} />
                <span className="text-sm font-medium text-gray-700">Crecimiento Garantizado</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Tecnología que transforma carreras
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre cómo nuestra plataforma revoluciona el proceso de evaluación y conexión de talento
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap size={28} className="text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">IA Conversacional</h4>
              <p className="text-sm text-gray-600">
                Entrevistas naturales que evalúan habilidades de forma inteligente y precisa
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp size={28} className="text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Análisis Profundo</h4>
              <p className="text-sm text-gray-600">
                Evaluación de 5 habilidades blandas con visualización en tiempo real
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield size={28} className="text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Credenciales Seguras</h4>
              <p className="text-sm text-gray-600">
                Certificaciones digitales verificables que no pueden ser falsificadas
              </p>
            </div>
            
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users size={28} className="text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Conexiones Perfectas</h4>
              <p className="text-sm text-gray-600">
                Matching inteligente entre candidatos y oportunidades laborales
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Portal Cards Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Elige tu camino hacia el éxito
          </h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Accede al portal diseñado específicamente para tu rol y comienza a transformar tu futuro profesional
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {portals.map((portal) => (
            <PortalCard key={portal.role} {...portal} />
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <HireTreeLogo size={32} showText={false} />
              <h3 className="text-3xl font-bold">¿Por qué HireTree?</h3>
            </div>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Creemos que cada persona tiene un potencial único. Nuestra plataforma utiliza tecnología avanzada 
              para revelar ese potencial y conectarlo con las oportunidades perfectas, creando un ecosistema 
              donde el talento florece naturalmente.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                <TreePine size={32} className="text-green-300" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-green-100">Crecimiento</h4>
              <p className="text-green-200">
                Nutrimos el desarrollo del talento de forma orgánica, creando oportunidades 
                que impulsan carreras hacia nuevas alturas.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
                <Users size={32} className="text-emerald-300" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-emerald-100">Conexión</h4>
              <p className="text-emerald-200">
                Construimos puentes auténticos entre el talento excepcional 
                y las organizaciones que buscan innovación.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500/20 rounded-full mb-4">
                <Shield size={32} className="text-teal-300" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-teal-100">Confianza</h4>
              <p className="text-teal-200">
                Establecemos confianza duradera a través de la transparencia, 
                verificación y credenciales inmutables.
              </p>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-2xl max-w-2xl mx-auto">
              <h4 className="text-2xl font-bold mb-4">¿Listo para hacer crecer tu futuro?</h4>
              <p className="text-green-100 mb-6">
                Únete a miles de profesionales que ya confían en HireTree para impulsar sus carreras
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-green-600 hover:bg-green-50 font-medium"
                >
                  Comenzar como Postulante
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/10 font-medium"
                >
                  Explorar para Empresas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}