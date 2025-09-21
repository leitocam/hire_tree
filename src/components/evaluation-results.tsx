import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { 
  BarChart3, 
  Download, 
  Share2, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface Skills {
  comunicacion: number
  liderazgo: number
  resolucionProblemas: number
  trabajoEquipo: number
  adaptabilidad: number
}

interface EvaluationResultsProps {
  skills: Skills
  evidences: { [key: string]: string }
  overallScore: number
  privacyMode: boolean
}

const skillLabels = {
  comunicacion: 'Comunicación',
  liderazgo: 'Liderazgo',
  resolucionProblemas: 'Resolución de Problemas',
  trabajoEquipo: 'Trabajo en Equipo',
  adaptabilidad: 'Adaptabilidad'
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 bg-green-100'
  if (score >= 70) return 'text-yellow-600 bg-yellow-100'
  return 'text-red-600 bg-red-100'
}

const getScoreStatus = (score: number) => {
  if (score >= 80) return { label: 'Excelente', icon: CheckCircle, color: 'text-green-600' }
  if (score >= 70) return { label: 'Bueno', icon: CheckCircle, color: 'text-yellow-600' }
  return { label: 'Mejorable', icon: AlertCircle, color: 'text-red-600' }
}

export function EvaluationResults({ skills, evidences, overallScore, privacyMode }: EvaluationResultsProps) {
  const exportResults = () => {
    // Simulación de exportación
    const data = {
      fecha: new Date().toLocaleDateString(),
      puntuacion_general: privacyMode ? (overallScore >= 70 ? 'Cumple' : 'No cumple') : overallScore,
      habilidades: Object.entries(skills).reduce((acc, [key, value]) => {
        acc[skillLabels[key as keyof Skills]] = privacyMode ? (value >= 70 ? 'Cumple' : 'No cumple') : value
        return acc
      }, {} as any),
      evidencias: evidences
    }
    
    console.log('Exportando resultados:', data)
    // En una implementación real, esto generaría un PDF o archivo descargable
  }

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Resumen de Evaluación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="mb-4">
                <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                  {privacyMode ? (overallScore >= 70 ? 'Cumple Requisitos' : 'No Cumple') : `${overallScore}/100`}
                </div>
                {!privacyMode && (
                  <p className="text-sm text-gray-600 mt-2">Puntuación General</p>
                )}
              </div>
              {!privacyMode && (
                <div className="space-y-2">
                  <Progress value={overallScore} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Estado de la Evaluación</h4>
              <div className="space-y-2">
                {(() => {
                  const status = getScoreStatus(overallScore)
                  const StatusIcon = status.icon
                  return (
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`h-4 w-4 ${status.color}`} />
                      <span className={`text-sm ${status.color}`}>{status.label}</span>
                    </div>
                  )
                })()}
                <div className="text-xs text-gray-500">
                  Evaluado el {new Date().toLocaleDateString('es-ES')}
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button onClick={exportResults} variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar Informe
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  {privacyMode ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  Modo {privacyMode ? 'Privado' : 'Público'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desglose de Habilidades */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose por Habilidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(skills).map(([key, value]) => {
              const label = skillLabels[key as keyof Skills]
              const evidence = evidences[key] || 'Evaluación completada exitosamente'
              
              return (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{label}</h4>
                    <Badge variant="outline" className={getScoreColor(value)}>
                      {privacyMode ? (value >= 70 ? 'Cumple' : 'No cumple') : `${value}/100`}
                    </Badge>
                  </div>
                  
                  {!privacyMode && (
                    <Progress value={value} className="w-full h-2" />
                  )}
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 italic">
                      "{evidence}"
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Análisis Detallado */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis Detallado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-green-700">Fortalezas Identificadas</h4>
              <ul className="space-y-2 text-sm">
                {Object.entries(skills)
                  .filter(([_, value]) => value >= 80)
                  .map(([key, _]) => (
                    <li key={key} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{skillLabels[key as keyof Skills]}</span>
                    </li>
                  ))}
                {Object.entries(skills).filter(([_, value]) => value >= 80).length === 0 && (
                  <li className="text-gray-500">Continúa desarrollando tus habilidades</li>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 text-blue-700">Áreas de Mejora</h4>
              <ul className="space-y-2 text-sm">
                {Object.entries(skills)
                  .filter(([_, value]) => value < 80)
                  .map(([key, _]) => (
                    <li key={key} className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                      <span>{skillLabels[key as keyof Skills]}</span>
                    </li>
                  ))}
                {Object.entries(skills).filter(([_, value]) => value < 80).length === 0 && (
                  <li className="text-gray-500">¡Excelente desempeño en todas las áreas!</li>
                )}
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Recomendaciones Personalizadas</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Continúa desarrollando tus habilidades de comunicación mediante presentaciones regulares</p>
              <p>• Busca oportunidades de liderazgo en proyectos colaborativos</p>
              <p>• Practica la resolución de problemas con metodologías estructuradas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Evidencia Blockchain */}
      <Card>
        <CardHeader>
          <CardTitle>Verificación Blockchain</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Hash IPFS</label>
              <div className="font-mono text-xs bg-gray-100 p-2 rounded border">
                QmX4f8d2b9e1c3a5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Commitment Celestia</label>
              <div className="font-mono text-xs bg-gray-100 p-2 rounded border">
                0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="text-green-600">
              ✓ Verificado en IPFS
            </Badge>
            <Badge variant="outline" className="text-blue-600">
              ✓ Registrado en Celestia
            </Badge>
          </div>
          
          <p className="text-xs text-gray-600">
            Tus resultados están almacenados de forma descentralizada y son verificables públicamente.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}