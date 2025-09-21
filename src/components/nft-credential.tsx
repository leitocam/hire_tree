import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  Award, 
  Download, 
  Share2, 
  ExternalLink, 
  Copy,
  Shield,
  Zap,
  CheckCircle
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface Skills {
  comunicacion: number
  liderazgo: number
  resolucionProblemas: number
  trabajoEquipo: number
  adaptabilidad: number
}

interface NFTCredentialProps {
  hasNFT: boolean
  score: number
  skills: Skills
  onShare: () => void
}

const skillLabels = {
  comunicacion: 'Comunicación',
  liderazgo: 'Liderazgo',
  resolucionProblemas: 'Resolución de Problemas',
  trabajoEquipo: 'Trabajo en Equipo',
  adaptabilidad: 'Adaptabilidad'
}

export function NFTCredential({ hasNFT, score, skills, onShare }: NFTCredentialProps) {
  const [isMinting, setIsMinting] = useState(false)
  const [nftMinted, setNftMinted] = useState(hasNFT)

  const handleMintNFT = async () => {
    setIsMinting(true)
    
    // Simulación del proceso de mint
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setNftMinted(true)
    setIsMinting(false)
    toast.success('¡Credencial digital creada exitosamente!')
  }

  const copyNFTAddress = () => {
    navigator.clipboard.writeText('0x742d35Cc6cF42532a8633b4F0900bCdD50f6d4CB')
    toast.success('Dirección copiada al portapapeles')
  }

  const copyVerificationLink = () => {
    navigator.clipboard.writeText('https://hiretree.com/verify/0x742d35Cc6cF42532a8633b4F0900bCdD50f6d4CB')
    toast.success('Enlace de verificación copiado')
  }

  if (!hasNFT && score < 70) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Award className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="font-medium text-gray-600 mb-2">Credencial Digital No Disponible</h3>
          <p className="text-sm text-gray-500 mb-4">
            Completa tu entrevista con una puntuación mínima de 70/100 para obtener tu credencial digital verificable
          </p>
          <Badge variant="outline" className="text-gray-500">
            Puntuación actual: {score}/100
          </Badge>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* NFT Display Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-500 opacity-5"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-green-600" />
            Credencial Digital Verificable
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid md:grid-cols-2 gap-6">
            {/* NFT Visual */}
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-500 rounded-xl p-6 text-white mb-4 aspect-square flex flex-col justify-center items-center max-w-64 mx-auto shadow-lg">
                <div className="mb-3 p-2 bg-white/20 rounded-full">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-lg mb-1">HireTree</h3>
                <p className="text-xs opacity-90 mb-3">Credencial Verificada</p>
                <div className="bg-white/20 rounded-lg p-3 mb-3 w-full text-center">
                  <div className="text-2xl font-bold mb-1">{score}/100</div>
                  <div className="text-xs opacity-90">Puntuación Global</div>
                </div>
                <div className="grid grid-cols-3 gap-1 w-full text-center text-xs">
                  {Object.entries(skills).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="bg-white/10 rounded px-1 py-1">
                      <div className="font-medium">{value}</div>
                      <div className="text-xs opacity-75">{skillLabels[key as keyof Skills].split(' ')[0]}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs opacity-75 mt-2">
                  ID: #{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                </div>
              </div>
              
              {!nftMinted ? (
                <Button 
                  onClick={handleMintNFT}
                  disabled={isMinting}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isMinting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generando Credencial...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Generar Credencial Digital
                    </>
                  )}
                </Button>
              ) : (
                <Badge className="bg-green-100 text-green-800 flex items-center gap-2 justify-center py-2">
                  <CheckCircle className="h-4 w-4" />
                  Credencial Generada Exitosamente
                </Badge>
              )}
            </div>

            {/* NFT Details */}
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Puntuaciones por Habilidad</h4>
                <div className="space-y-3">
                  {Object.entries(skills).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{skillLabels[key as keyof Skills]}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{value}/100</span>
                          <Badge 
                            variant={value >= 70 ? "default" : "outline"}
                            className={value >= 70 ? "bg-green-100 text-green-800" : ""}
                          >
                            {value >= 70 ? "✓" : "—"}
                          </Badge>
                        </div>
                      </div>
                      <Progress 
                        value={value} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Desglose Detallado</h4>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-800">Promedio General</span>
                      <span className="font-bold text-green-600">{score}/100</span>
                    </div>
                    <Progress value={score} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Habilidades aprobadas:</span>
                      <div className="font-bold text-gray-900">
                        {Object.values(skills).filter(v => v >= 70).length}/5
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="text-gray-600">Mejor puntuación:</span>
                      <div className="font-bold text-green-600">
                        {Math.max(...Object.values(skills))}/100
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NFT Information & Actions */}
      {nftMinted && (
        <Card>
          <CardHeader>
            <CardTitle>Información de la Credencial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">ID de Credencial</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 text-xs bg-gray-100 p-2 rounded border font-mono">
                    0x742d35Cc6cF42532a8633b4F0900bCdD50f6d4CB
                  </code>
                  <Button size="sm" variant="outline" onClick={copyNFTAddress}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600">Número de Serie</label>
                <div className="text-sm font-mono bg-gray-100 p-2 rounded border mt-1">
                  #{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Identificador de Datos</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="flex-1 text-xs bg-gray-100 p-2 rounded border font-mono">
                  HT4B8Xf2d9e1c3a5f6g7h8i9j0k1l2m3n4o5p6q7CRED
                </code>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={copyVerificationLink} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                Copiar Link de Verificación
              </Button>
              <Button variant="outline" onClick={onShare} className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Compartir Credencial
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Descargar Metadatos
              </Button>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">¿Cómo usar tu credencial?</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p>• Compártela con empresas para demostrar tus habilidades</p>
                <p>• Añádela a tu perfil de LinkedIn o portafolio profesional</p>
                <p>• Úsala como prueba verificable de tu evaluación</p>
                <p>• Los empleadores pueden verificarla de forma independiente</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Detalles de Verificación</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-gray-600">Plataforma:</span>
                  <span className="ml-2 font-mono">HireTree</span>
                </div>
                <div>
                  <span className="text-gray-600">Tipo:</span>
                  <span className="ml-2 font-mono">Credencial Digital</span>
                </div>
                <div>
                  <span className="text-gray-600">Fecha de emisión:</span>
                  <span className="ml-2">{new Date().toLocaleDateString('es-ES')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <span className="ml-2 text-green-600">✓ Activo</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}