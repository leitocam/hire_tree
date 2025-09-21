import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { useAuth } from './auth-context'
import { InterviewSystem } from './interview-system'
import { EvaluationResults } from './evaluation-results'
import { NFTCredential } from './nft-credential'
import { 
  User, 
  MessageSquare, 
  BarChart3, 
  Award, 
  LogOut, 
  Upload,
  Eye,
  EyeOff,
  Share2,
  FileText
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface ApplicantProfile {
  completedInterview: boolean
  interviewScore: number
  skills: {
    comunicacion: number
    liderazgo: number
    resolucionProblemas: number
    trabajoEquipo: number
    adaptabilidad: number
  }
  evidences: {
    [key: string]: string
  }
  hasNFT: boolean
  privacyMode: boolean
}

export function ApplicantDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('perfil')
  
  // Estado simulado del perfil
  const [profile, setProfile] = useState<ApplicantProfile>({
    completedInterview: false,
    interviewScore: 0,
    skills: {
      comunicacion: 0,
      liderazgo: 0,
      resolucionProblemas: 0,
      trabajoEquipo: 0,
      adaptabilidad: 0
    },
    evidences: {},
    hasNFT: false,
    privacyMode: false
  })

  const [showInterview, setShowInterview] = useState(false)

  const handleInterviewComplete = (results: any) => {
    setProfile({
      ...profile,
      completedInterview: true,
      interviewScore: results.overallScore,
      skills: results.skills,
      evidences: results.evidences,
      hasNFT: results.overallScore >= 70 // Umbral para NFT
    })
    setShowInterview(false)
    setActiveTab('resultados')
    toast.success('¡Entrevista completada exitosamente!')
  }

  const togglePrivacyMode = () => {
    setProfile({ ...profile, privacyMode: !profile.privacyMode })
    toast.info(profile.privacyMode ? 'Puntajes exactos ahora visibles' : 'Modo privacidad activado')
  }

  const shareProfile = () => {
    toast.success('Enlace de perfil copiado al portapapeles')
  }

  if (showInterview) {
    return <InterviewSystem onComplete={handleInterviewComplete} onCancel={() => setShowInterview(false)} />
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl">Dashboard de Talento</h1>
          <p className="text-gray-600">Bienvenido, {user?.name}</p>
        </div>
        <Button variant="outline" onClick={logout} className="flex items-center gap-2">
          <LogOut size={16} />
          Cerrar Sesión
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User size={16} />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="entrevista" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Entrevista
          </TabsTrigger>
          <TabsTrigger value="resultados" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Resultados
          </TabsTrigger>
          <TabsTrigger value="credencial" className="flex items-center gap-2">
            <Award size={16} />
            Credencial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Completa tu perfil para mejorar tus oportunidades</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Nombre completo</label>
                  <p className="font-medium">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">CV / Currículum</label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Haz clic para subir tu CV (PDF, DOC, DOCX)
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Configuración de Privacidad</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-800">
                    Ocultar puntajes exactos (solo mostrar "cumple/no cumple")
                  </span>
                  <Button
                    variant={profile.privacyMode ? "default" : "outline"}
                    size="sm"
                    onClick={togglePrivacyMode}
                    className="flex items-center gap-2"
                  >
                    {profile.privacyMode ? <EyeOff size={16} /> : <Eye size={16} />}
                    {profile.privacyMode ? 'Privado' : 'Público'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entrevista" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Entrevista Automatizada</CardTitle>
              <CardDescription>
                Completa tu entrevista con IA para obtener tu evaluación de habilidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!profile.completedInterview ? (
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                    <MessageSquare size={32} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">¿Listo para tu entrevista?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      La entrevista incluye preguntas sobre situaciones laborales y habilidades blandas.
                      Duración aproximada: 15-20 minutos.
                    </p>
                    <div className="space-y-2 text-xs text-gray-500">
                      <p>• Disponible en modo texto y voz</p>
                      <p>• Preguntas adaptativas según tus respuestas</p>
                      <p>• Evaluación automática de 5 dimensiones clave</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowInterview(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    Comenzar Entrevista
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-green-100 text-green-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Entrevista Completada</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Tu entrevista ha sido procesada exitosamente.
                    </p>
                    <Badge variant="secondary" className="mb-4">
                      Puntuación: {profile.privacyMode ? 'Cumple requisitos' : `${profile.interviewScore}/100`}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setShowInterview(true)}
                  >
                    Realizar Nueva Entrevista
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resultados">
          {profile.completedInterview ? (
            <EvaluationResults 
              skills={profile.skills}
              evidences={profile.evidences}
              overallScore={profile.interviewScore}
              privacyMode={profile.privacyMode}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="font-medium text-gray-500 mb-2">Sin resultados disponibles</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Completa tu entrevista para ver tu evaluación de habilidades
                </p>
                <Button onClick={() => setActiveTab('entrevista')}>
                  Ir a Entrevista
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="credencial">
          <NFTCredential 
            hasNFT={profile.hasNFT}
            score={profile.interviewScore}
            skills={profile.skills}
            onShare={shareProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}