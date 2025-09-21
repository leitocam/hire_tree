import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { useAuth } from './auth-context'
import { 
  GraduationCap, 
  Users, 
  BarChart3, 
  FileText, 
  LogOut,
  Plus,
  TrendingUp,
  Award,
  Download,
  Eye,
  Star,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface Student {
  id: string
  name: string
  email: string
  cohort: string
  completedInterview: boolean
  score?: number
  skills?: {
    comunicacion: number
    liderazgo: number
    resolucionProblemas: number
    trabajoEquipo: number
    adaptabilidad: number
  }
  hasNFT: boolean
  hasConsent: boolean
  enrollmentDate: string
}

interface Cohort {
  id: string
  name: string
  program: string
  students: number
  avgScore: number
  completionRate: number
  startDate: string
  endDate: string
  status: 'active' | 'completed' | 'upcoming'
}

interface Recommendation {
  id: string
  studentId: string
  studentName: string
  type: 'letter' | 'attestation'
  content: string
  issuedDate: string
  recipient?: string
  status: 'draft' | 'issued' | 'verified'
}

const mockCohorts: Cohort[] = [
  {
    id: '1',
    name: 'Desarrollo Web 2024-1',
    program: 'Bootcamp Full Stack',
    students: 25,
    avgScore: 79,
    completionRate: 88,
    startDate: '2024-01-15',
    endDate: '2024-06-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'Data Science 2024-1',
    program: 'Especialización en IA',
    students: 18,
    avgScore: 82,
    completionRate: 94,
    startDate: '2024-02-01',
    endDate: '2024-07-01',
    status: 'active'
  },
  {
    id: '3',
    name: 'UX/UI Design 2023-2',
    program: 'Diseño Digital',
    students: 22,
    avgScore: 85,
    completionRate: 100,
    startDate: '2023-09-01',
    endDate: '2024-02-01',
    status: 'completed'
  }
]

const mockStudents: Student[] = [
  {
    id: '1',
    name: 'María García',
    email: 'maria.garcia@student.edu',
    cohort: 'Desarrollo Web 2024-1',
    completedInterview: true,
    score: 82,
    skills: {
      comunicacion: 85,
      liderazgo: 75,
      resolucionProblemas: 88,
      trabajoEquipo: 80,
      adaptabilidad: 82
    },
    hasNFT: true,
    hasConsent: true,
    enrollmentDate: '2024-01-15'
  },
  {
    id: '2',
    name: 'Carlos López',
    email: 'carlos.lopez@student.edu',
    cohort: 'Desarrollo Web 2024-1',
    completedInterview: true,
    score: 78,
    skills: {
      comunicacion: 80,
      liderazgo: 72,
      resolucionProblemas: 85,
      trabajoEquipo: 75,
      adaptabilidad: 78
    },
    hasNFT: true,
    hasConsent: true,
    enrollmentDate: '2024-01-15'
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana.martinez@student.edu',
    cohort: 'Data Science 2024-1',
    completedInterview: true,
    score: 88,
    skills: {
      comunicacion: 90,
      liderazgo: 92,
      resolucionProblemas: 85,
      trabajoEquipo: 88,
      adaptabilidad: 80
    },
    hasNFT: true,
    hasConsent: false,
    enrollmentDate: '2024-02-01'
  }
]

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'María García',
    type: 'letter',
    content: 'Excelente estudiante con habilidades sobresalientes en desarrollo frontend...',
    issuedDate: '2024-01-20',
    recipient: 'TechCorp Inc.',
    status: 'issued'
  },
  {
    id: '2',
    studentId: '3',
    studentName: 'Ana Martínez',
    type: 'attestation',
    content: 'Demostró competencias excepcionales en ciencia de datos y liderazgo...',
    issuedDate: '2024-01-18',
    status: 'verified'
  }
]

const skillLabels = {
  comunicacion: 'Comunicación',
  liderazgo: 'Liderazgo',
  resolucionProblemas: 'Resolución de Problemas',
  trabajoEquipo: 'Trabajo en Equipo',
  adaptabilidad: 'Adaptabilidad'
}

export function EducationalDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('cohortes')
  const [cohorts] = useState<Cohort[]>(mockCohorts)
  const [students] = useState<Student[]>(mockStudents)
  const [recommendations] = useState<Recommendation[]>(mockRecommendations)
  const [selectedCohort, setSelectedCohort] = useState<string>('all')

  const filteredStudents = students.filter(student => 
    selectedCohort === 'all' || student.cohort === selectedCohort
  ).filter(student => student.hasConsent) // Solo mostrar estudiantes que han dado consentimiento

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'upcoming': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activa'
      case 'completed': return 'Completada'
      case 'upcoming': return 'Próxima'
      default: return status
    }
  }

  const exportCohortReport = (cohort: Cohort) => {
    const cohortStudents = students.filter(s => s.cohort === cohort.name && s.hasConsent)
    const report = {
      cohort: cohort.name,
      program: cohort.program,
      studentsCount: cohortStudents.length,
      averageScore: cohortStudents.reduce((sum, s) => sum + (s.score || 0), 0) / cohortStudents.length,
      skillsBreakdown: Object.keys(skillLabels).reduce((acc, skill) => {
        const avgSkill = cohortStudents
          .filter(s => s.skills)
          .reduce((sum, s) => sum + (s.skills![skill as keyof typeof s.skills] || 0), 0) / 
          cohortStudents.filter(s => s.skills).length
        acc[skill] = Math.round(avgSkill)
        return acc
      }, {} as any)
    }
    
    console.log('Reporte de cohorte exportado:', report)
    toast.success('Reporte de cohorte exportado exitosamente')
  }

  const issueRecommendation = (student: Student, type: 'letter' | 'attestation') => {
    toast.success(`${type === 'letter' ? 'Carta de recomendación' : 'Attestation'} generado para ${student.name}`)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl">Dashboard Educacional</h1>
          <p className="text-gray-600">Bienvenido, {user?.name}</p>
        </div>
        <Button variant="outline" onClick={logout} className="flex items-center gap-2">
          <LogOut size={16} />
          Cerrar Sesión
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cohortes" className="flex items-center gap-2">
            <GraduationCap size={16} />
            Cohortes
          </TabsTrigger>
          <TabsTrigger value="estudiantes" className="flex items-center gap-2">
            <Users size={16} />
            Estudiantes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="recomendaciones" className="flex items-center gap-2">
            <FileText size={16} />
            Recomendaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cohortes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Cohortes</CardTitle>
              <CardDescription>Supervisa el progreso de tus programas educacionales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {cohorts.map((cohort) => (
                  <Card key={cohort.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">{cohort.name}</h3>
                          <p className="text-sm text-gray-600">{cohort.program}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>{cohort.students} estudiantes</span>
                            <span>Promedio: {cohort.avgScore}/100</span>
                            <span>Completación: {cohort.completionRate}%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(cohort.status)}>
                            {getStatusLabel(cohort.status)}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => exportCohortReport(cohort)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-gray-500">Inicio</label>
                          <div className="text-sm font-medium">
                            {new Date(cohort.startDate).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Finalización</label>
                          <div className="text-sm font-medium">
                            {new Date(cohort.endDate).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Progreso</label>
                          <Progress value={cohort.completionRate} className="w-full mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estudiantes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Estudiantes y Evaluaciones</CardTitle>
                  <CardDescription>
                    Supervisa el progreso de estudiantes que han autorizado compartir sus datos
                  </CardDescription>
                </div>
                <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Filtrar por cohorte" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las cohortes</SelectItem>
                    {cohorts.map(cohort => (
                      <SelectItem key={cohort.id} value={cohort.name}>
                        {cohort.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Cohorte</TableHead>
                    <TableHead>Evaluación</TableHead>
                    <TableHead>Puntuación</TableHead>
                    <TableHead>NFT</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{student.cohort}</TableCell>
                      <TableCell>
                        <Badge variant={student.completedInterview ? "default" : "secondary"}>
                          {student.completedInterview ? 'Completada' : 'Pendiente'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {student.score ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{student.score}/100</span>
                            <Progress value={student.score} className="w-16 h-2" />
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {student.hasNFT ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-gray-200"></div>
                        )}
                      </TableCell>
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
                                <DialogTitle>Perfil de {student.name}</DialogTitle>
                              </DialogHeader>
                              {student.skills ? (
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-medium mb-3">Habilidades Evaluadas</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      {Object.entries(student.skills).map(([skill, score]) => (
                                        <div key={skill} className="space-y-2">
                                          <div className="flex justify-between">
                                            <span className="text-sm capitalize">
                                              {skillLabels[skill as keyof typeof skillLabels]}
                                            </span>
                                            <span className="text-sm font-medium">{score}/100</span>
                                          </div>
                                          <Progress value={score} className="w-full" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button 
                                      size="sm"
                                      onClick={() => issueRecommendation(student, 'letter')}
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      Carta de Recomendación
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => issueRecommendation(student, 'attestation')}
                                    >
                                      <Award className="h-4 w-4 mr-2" />
                                      Attestation
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-500">El estudiante aún no ha completado su evaluación.</p>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Generar Recomendación - {student.name}</DialogTitle>
                              </DialogHeader>
                              <form className="space-y-4">
                                <div>
                                  <Label>Tipo de recomendación</Label>
                                  <Select defaultValue="letter">
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="letter">Carta de Recomendación</SelectItem>
                                      <SelectItem value="attestation">Attestation Blockchain</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div>
                                  <Label htmlFor="recipient">Destinatario (opcional)</Label>
                                  <Input id="recipient" placeholder="Empresa o institución" />
                                </div>
                                
                                <div>
                                  <Label htmlFor="content">Contenido</Label>
                                  <Textarea 
                                    id="content" 
                                    placeholder="Describe las fortalezas y logros del estudiante..."
                                    rows={4}
                                  />
                                </div>
                                
                                <Button type="submit" className="w-full">
                                  Generar Recomendación
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay estudiantes que hayan autorizado compartir sus datos en esta cohorte.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">65</div>
                  <p className="text-sm text-gray-600">Estudiantes Totales</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">48</div>
                  <p className="text-sm text-gray-600">Evaluaciones Completadas</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">81</div>
                  <p className="text-sm text-gray-600">Promedio General</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">36</div>
                  <p className="text-sm text-gray-600">NFTs Emitidos</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolución de Habilidades por Programa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {cohorts.map(cohort => (
                  <div key={cohort.id}>
                    <h4 className="font-medium mb-3">{cohort.name}</h4>
                    <div className="space-y-3">
                      {Object.entries(skillLabels).map(([skillKey, skillLabel]) => {
                        const cohortStudents = students.filter(s => s.cohort === cohort.name && s.skills && s.hasConsent)
                        const avgScore = cohortStudents.length > 0 
                          ? cohortStudents.reduce((sum, s) => sum + (s.skills![skillKey as keyof typeof s.skills] || 0), 0) / cohortStudents.length
                          : 0
                        
                        return (
                          <div key={skillKey}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">{skillLabel}</span>
                              <span className="text-sm font-medium">{Math.round(avgScore)}/100</span>
                            </div>
                            <Progress value={avgScore} className="w-full" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tendencias y Comparativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Mejores Desempeños por Habilidad</h4>
                  <div className="space-y-2">
                    {Object.entries(skillLabels).map(([skill, label]) => (
                      <div key={skill} className="flex items-center justify-between">
                        <span className="text-sm">{label}</span>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">+5.2%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Comparativa entre Cohortes</h4>
                  <div className="space-y-2">
                    {cohorts.slice(0, 3).map(cohort => (
                      <div key={cohort.id} className="flex items-center justify-between">
                        <span className="text-sm">{cohort.name}</span>
                        <Badge variant="outline">
                          {cohort.avgScore}/100
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recomendaciones" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recomendaciones Emitidas</CardTitle>
                  <CardDescription>
                    Gestiona cartas de recomendación y attestations para tus estudiantes
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus size={16} />
                      Nueva Recomendación
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Crear Nueva Recomendación</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div>
                        <Label>Estudiante</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar estudiante" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredStudents.map(student => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name} - {student.cohort}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Tipo</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de recomendación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="letter">Carta de Recomendación</SelectItem>
                            <SelectItem value="attestation">Attestation Blockchain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="recipient">Destinatario</Label>
                        <Input id="recipient" placeholder="Empresa o institución" />
                      </div>
                      
                      <div>
                        <Label htmlFor="content">Contenido</Label>
                        <Textarea id="content" rows={4} />
                      </div>
                      
                      <Button type="submit" className="w-full">
                        Crear Recomendación
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Destinatario</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recommendations.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell className="font-medium">{rec.studentName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {rec.type === 'letter' ? 'Carta' : 'Attestation'}
                        </Badge>
                      </TableCell>
                      <TableCell>{rec.recipient || 'General'}</TableCell>
                      <TableCell>
                        <Badge className={
                          rec.status === 'issued' ? 'bg-green-100 text-green-800' :
                          rec.status === 'verified' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {rec.status === 'issued' ? 'Emitido' :
                           rec.status === 'verified' ? 'Verificado' : 'Borrador'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(rec.issuedDate).toLocaleDateString('es-ES')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
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
      </Tabs>
    </div>
  )
}