import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { useAuth } from './auth-context'
import { 
  Building, 
  Plus, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  ExternalLink,
  Award,
  Star
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface JobPosition {
  id: string
  title: string
  department: string
  status: 'active' | 'paused' | 'closed'
  applicants: number
  threshold: number
  skills: {
    comunicacion: number
    liderazgo: number
    resolucionProblemas: number
    trabajoEquipo: number
    adaptabilidad: number
  }
  createdAt: string
}

interface Candidate {
  id: string
  name: string
  email: string
  position: string
  score: number
  appliedAt: string
  status: 'pending' | 'reviewed' | 'approved' | 'rejected'
  hasNFT: boolean
  skills: {
    comunicacion: number
    liderazgo: number
    resolucionProblemas: number
    trabajoEquipo: number
    adaptabilidad: number
  }
}

const mockPositions: JobPosition[] = [
  {
    id: '1',
    title: 'Desarrollador Frontend Senior',
    department: 'Tecnología',
    status: 'active',
    applicants: 12,
    threshold: 75,
    skills: {
      comunicacion: 80,
      liderazgo: 70,
      resolucionProblemas: 85,
      trabajoEquipo: 75,
      adaptabilidad: 80
    },
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Producto',
    status: 'active',
    applicants: 8,
    threshold: 80,
    skills: {
      comunicacion: 85,
      liderazgo: 90,
      resolucionProblemas: 80,
      trabajoEquipo: 85,
      adaptabilidad: 75
    },
    createdAt: '2024-01-10'
  }
]

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'María García',
    email: 'maria.garcia@email.com',
    position: 'Desarrollador Frontend Senior',
    score: 82,
    appliedAt: '2024-01-20',
    status: 'approved',
    hasNFT: true,
    skills: {
      comunicacion: 85,
      liderazgo: 75,
      resolucionProblemas: 88,
      trabajoEquipo: 80,
      adaptabilidad: 82
    }
  },
  {
    id: '2',
    name: 'Carlos López',
    email: 'carlos.lopez@email.com',
    position: 'Desarrollador Frontend Senior',
    score: 78,
    appliedAt: '2024-01-18',
    status: 'pending',
    hasNFT: true,
    skills: {
      comunicacion: 80,
      liderazgo: 72,
      resolucionProblemas: 85,
      trabajoEquipo: 75,
      adaptabilidad: 78
    }
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    position: 'Product Manager',
    score: 88,
    appliedAt: '2024-01-16',
    status: 'reviewed',
    hasNFT: true,
    skills: {
      comunicacion: 90,
      liderazgo: 92,
      resolucionProblemas: 85,
      trabajoEquipo: 88,
      adaptabilidad: 80
    }
  }
]

export function CompanyDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('pipeline')
  const [positions] = useState<JobPosition[]>(mockPositions)
  const [candidates] = useState<Candidate[]>(mockCandidates)
  const [selectedPosition, setSelectedPosition] = useState<string>('all')
  const [candidateFilter, setCandidateFilter] = useState<string>('all')

  const filteredCandidates = candidates.filter(candidate => {
    if (selectedPosition !== 'all' && candidate.position !== selectedPosition) return false
    if (candidateFilter === 'approved' && candidate.status !== 'approved') return false
    if (candidateFilter === 'pending' && candidate.status !== 'pending') return false
    if (candidateFilter === 'nft' && !candidate.hasNFT) return false
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewed': return 'bg-blue-100 text-blue-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobado'
      case 'pending': return 'Pendiente'
      case 'reviewed': return 'Revisado'
      case 'rejected': return 'Rechazado'
      default: return status
    }
  }

  const exportCompatibilityReport = (candidate: Candidate) => {
    const position = positions.find(p => p.title === candidate.position)
    if (!position) return

    const compatibility = Object.entries(candidate.skills).map(([skill, candidateScore]) => {
      const requiredScore = position.skills[skill as keyof typeof position.skills]
      const match = (candidateScore / requiredScore) * 100
      return {
        skill,
        candidateScore,
        requiredScore,
        match: Math.min(match, 100)
      }
    })

    console.log('Reporte de compatibilidad:', {
      candidate: candidate.name,
      position: position.title,
      compatibility,
      overallMatch: compatibility.reduce((sum, item) => sum + item.match, 0) / compatibility.length
    })
    
    toast.success('Reporte de compatibilidad exportado')
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl">Dashboard Empresarial</h1>
          <p className="text-gray-600">Bienvenido, {user?.name}</p>
        </div>
        <Button variant="outline" onClick={logout} className="flex items-center gap-2">
          <LogOut size={16} />
          Cerrar Sesión
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline" className="flex items-center gap-2">
            <Users size={16} />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="vacantes" className="flex items-center gap-2">
            <Building size={16} />
            Vacantes
          </TabsTrigger>
          <TabsTrigger value="metricas" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Métricas
          </TabsTrigger>
          <TabsTrigger value="verificacion" className="flex items-center gap-2">
            <Award size={16} />
            Verificación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pipeline de Candidatos</CardTitle>
                  <CardDescription>Gestiona y evalúa a los candidatos postulados</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filtrar por posición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las posiciones</SelectItem>
                      {positions.map(position => (
                        <SelectItem key={position.id} value={position.title}>
                          {position.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={candidateFilter} onValueChange={setCandidateFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendientes</SelectItem>
                      <SelectItem value="approved">Aprobados</SelectItem>
                      <SelectItem value="nft">Con NFT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidato</TableHead>
                    <TableHead>Posición</TableHead>
                    <TableHead>Puntuación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>NFT</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{candidate.name}</div>
                          <div className="text-sm text-gray-500">{candidate.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.position}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{candidate.score}/100</span>
                          <Progress value={candidate.score} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(candidate.status)}>
                          {getStatusLabel(candidate.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {candidate.hasNFT ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </TableCell>
                      <TableCell>{new Date(candidate.appliedAt).toLocaleDateString('es-ES')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Perfil de {candidate.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Habilidades</h4>
                                    <div className="space-y-2">
                                      {Object.entries(candidate.skills).map(([skill, score]) => (
                                        <div key={skill} className="flex items-center justify-between">
                                          <span className="text-sm capitalize">{skill}</span>
                                          <div className="flex items-center gap-2">
                                            <Progress value={score} className="w-20 h-2" />
                                            <span className="text-sm font-medium w-8">{score}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2">Compatibilidad con Puesto</h4>
                                    {(() => {
                                      const position = positions.find(p => p.title === candidate.position)
                                      if (!position) return <p className="text-sm text-gray-500">No disponible</p>
                                      
                                      const compatibility = Object.entries(candidate.skills).map(([skill, score]) => {
                                        const required = position.skills[skill as keyof typeof position.skills]
                                        return Math.min((score / required) * 100, 100)
                                      })
                                      const avgCompatibility = compatibility.reduce((a, b) => a + b) / compatibility.length
                                      
                                      return (
                                        <div className="space-y-2">
                                          <div className="text-2xl font-bold text-green-600">
                                            {Math.round(avgCompatibility)}%
                                          </div>
                                          <Progress value={avgCompatibility} className="w-full" />
                                        </div>
                                      )
                                    })()}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => exportCompatibilityReport(candidate)}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Exportar Reporte
                                  </Button>
                                  {candidate.hasNFT && (
                                    <Button size="sm" variant="outline">
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      Verificar NFT
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            size="sm" 
                            onClick={() => exportCompatibilityReport(candidate)}
                            variant="outline"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vacantes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Gestión de Vacantes</CardTitle>
                  <CardDescription>Crea y administra tus ofertas de trabajo</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus size={16} />
                      Nueva Vacante
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Crear Nueva Vacante</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Título del Puesto</Label>
                          <Input id="title" placeholder="ej. Desarrollador Frontend Senior" />
                        </div>
                        <div>
                          <Label htmlFor="department">Departamento</Label>
                          <Input id="department" placeholder="ej. Tecnología" />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea id="description" placeholder="Describe las responsabilidades y requisitos..." />
                      </div>
                      
                      <div>
                        <Label>Criterios de Evaluación (peso por habilidad)</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          {['comunicacion', 'liderazgo', 'resolucionProblemas', 'trabajoEquipo', 'adaptabilidad'].map(skill => (
                            <div key={skill}>
                              <Label className="text-sm capitalize">{skill.replace(/([A-Z])/g, ' $1')}</Label>
                              <Input type="number" min="0" max="100" defaultValue="70" />
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="threshold">Umbral Mínimo (%)</Label>
                        <Input id="threshold" type="number" min="0" max="100" defaultValue="70" />
                      </div>
                      
                      <Button type="submit" className="w-full">
                        Crear Vacante
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {positions.map((position) => (
                  <Card key={position.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-medium">{position.title}</h3>
                          <p className="text-sm text-gray-600">{position.department}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>{position.applicants} postulaciones</span>
                            <span>Umbral: {position.threshold}%</span>
                            <span>Creado: {new Date(position.createdAt).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={position.status === 'active' ? 'default' : 'secondary'}>
                            {position.status === 'active' ? 'Activa' : 'Pausada'}
                          </Badge>
                          <Button size="sm" variant="outline">
                            <Settings size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Criterios requeridos:</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {Object.entries(position.skills).map(([skill, score]) => (
                            <div key={skill} className="text-center">
                              <div className="text-xs text-gray-500 mb-1 capitalize">
                                {skill.replace(/([A-Z])/g, ' $1')}
                              </div>
                              <div className="text-sm font-medium">{score}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metricas" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24</div>
                  <p className="text-sm text-gray-600">Candidatos Totales</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">78%</div>
                  <p className="text-sm text-gray-600">Tasa de Aprobación</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2.3</div>
                  <p className="text-sm text-gray-600">Días Promedio</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Habilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['comunicacion', 'liderazgo', 'resolucionProblemas', 'trabajoEquipo', 'adaptabilidad'].map(skill => {
                  const avgScore = Math.floor(Math.random() * 30) + 70
                  return (
                    <div key={skill}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm capitalize">{skill.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-sm font-medium">{avgScore}/100</span>
                      </div>
                      <Progress value={avgScore} className="w-full" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verificacion" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verificación de Credenciales NFT</CardTitle>
              <CardDescription>
                Verifica la autenticidad de las credenciales blockchain de los candidatos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="nft-address">Dirección del NFT o Token ID</Label>
                  <Input 
                    id="nft-address" 
                    placeholder="0x742d35Cc6cF42532a8633b4F0900bCdD50f6d4CB o #1234"
                  />
                </div>
                <Button className="mt-6">
                  <Search className="h-4 w-4 mr-2" />
                  Verificar
                </Button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Resultado de Verificación</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>NFT válido y verificado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Metadatos almacenados correctamente en IPFS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Commitment registrado en Celestia</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Información del Titular</Label>
                  <div className="bg-white p-3 rounded border mt-1">
                    <div className="font-medium">María García</div>
                    <div className="text-sm text-gray-600">Puntuación: 82/100</div>
                    <div className="text-xs text-gray-500">Emitido: 20/01/2024</div>
                  </div>
                </div>
                
                <div>
                  <Label>Enlaces de Verificación</Label>
                  <div className="space-y-2 mt-1">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver en Polygonscan
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver metadatos IPFS
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}