import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Progress } from './ui/progress'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { 
  MessageSquare, 
  Mic, 
  MicOff, 
  Send, 
  ArrowLeft, 
  Clock,
  Bot,
  User
} from 'lucide-react'

interface InterviewQuestion {
  id: number
  type: 'situational' | 'behavioral' | 'technical'
  dimension: 'comunicacion' | 'liderazgo' | 'resolucionProblemas' | 'trabajoEquipo' | 'adaptabilidad'
  question: string
  follow_up?: string
}

interface InterviewResults {
  overallScore: number
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
}

const sampleQuestions: InterviewQuestion[] = [
  {
    id: 1,
    type: 'behavioral',
    dimension: 'comunicacion',
    question: 'Cuéntame sobre una ocasión en la que tuviste que explicar un concepto complejo a alguien que no tenía conocimientos técnicos.',
    follow_up: '¿Qué estrategias utilizaste para asegurarte de que te entendieran?'
  },
  {
    id: 2,
    type: 'situational',
    dimension: 'liderazgo',
    question: 'Imagina que eres responsable de un proyecto y uno de los miembros del equipo constantemente entrega trabajo de baja calidad. ¿Cómo manejarías esta situación?'
  },
  {
    id: 3,
    type: 'behavioral',
    dimension: 'resolucionProblemas',
    question: 'Describe una situación en la que te enfrentaste a un problema que parecía no tener solución. ¿Cómo lo abordaste?'
  },
  {
    id: 4,
    type: 'situational',
    dimension: 'trabajoEquipo',
    question: 'Tu equipo tiene opiniones muy diferentes sobre cómo proceder con un proyecto importante. ¿Cómo ayudarías a encontrar un consenso?'
  },
  {
    id: 5,
    type: 'behavioral',
    dimension: 'adaptabilidad',
    question: 'Háblame de una ocasión en la que tuviste que adaptarte rápidamente a un cambio significativo en tu trabajo o estudios.'
  }
]

interface InterviewSystemProps {
  onComplete: (results: InterviewResults) => void
  onCancel: () => void
}

export function InterviewSystem({ onComplete, onCancel }: InterviewSystemProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{[key: number]: string}>({})
  const [isRecording, setIsRecording] = useState(false)
  const [mode, setMode] = useState<'text' | 'voice'>('text')
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const currentQuestion = sampleQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / sampleQuestions.length) * 100

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSubmit = () => {
    const currentAnswer = answers[currentQuestion.id]
    if (!currentAnswer?.trim()) return

    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Finalizar entrevista y analizar resultados
      analyzeResults()
    }
  }

  const analyzeResults = async () => {
    setIsAnalyzing(true)
    
    // Simulación de análisis con IA
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Generar resultados simulados basados en las respuestas
    const results: InterviewResults = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      skills: {
        comunicacion: Math.floor(Math.random() * 30) + 70,
        liderazgo: Math.floor(Math.random() * 30) + 65,
        resolucionProblemas: Math.floor(Math.random() * 30) + 75,
        trabajoEquipo: Math.floor(Math.random() * 30) + 80,
        adaptabilidad: Math.floor(Math.random() * 30) + 72
      },
      evidences: {
        comunicacion: 'Explicó conceptos técnicos de manera clara y estructurada',
        liderazgo: 'Demostró capacidad para tomar decisiones difíciles con empatía',
        resolucionProblemas: 'Aplicó metodología sistemática para resolver problemas complejos',
        trabajoEquipo: 'Mostró habilidades de mediación y construcción de consensos',
        adaptabilidad: 'Evidenció flexibilidad y resiliencia ante cambios inesperados'
      }
    }

    onComplete(results)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // Aquí se implementaría la grabación real de audio
  }

  const handleVoiceToText = () => {
    // Simulación de transcripción de voz a texto
    const simulatedTranscription = "Esta es una respuesta transcrita desde audio donde explico mi experiencia..."
    setAnswers({
      ...answers,
      [currentQuestion.id]: (answers[currentQuestion.id] || '') + simulatedTranscription
    })
  }

  if (isAnalyzing) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="font-medium mb-2">Analizando tus respuestas...</h3>
            <p className="text-sm text-gray-600 mb-4">
              Nuestro sistema inteligente está procesando tu entrevista y generando tu evaluación personalizada
            </p>
            <Progress value={66} className="w-full max-w-sm mx-auto" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Volver
          </Button>
          <div>
            <h1 className="text-xl">Entrevista Inteligente</h1>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Clock size={14} />
              Tiempo transcurrido: {formatTime(timeElapsed)}
            </p>
          </div>
        </div>
        <Badge variant="outline">
          Pregunta {currentQuestionIndex + 1} de {sampleQuestions.length}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progreso de la entrevista</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Question Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div>
                  <CardTitle className="text-lg">Evaluador IA</CardTitle>
                  <CardDescription>
                    Dimensión: {currentQuestion.dimension.charAt(0).toUpperCase() + currentQuestion.dimension.slice(1)}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-gray-800">{currentQuestion.question}</p>
                {currentQuestion.follow_up && (
                  <p className="text-gray-600 text-sm mt-2 italic">
                    Seguimiento: {currentQuestion.follow_up}
                  </p>
                )}
              </div>

              <Tabs value={mode} onValueChange={(value) => setMode(value as 'text' | 'voice')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    Texto
                  </TabsTrigger>
                  <TabsTrigger value="voice" className="flex items-center gap-2">
                    <Mic size={16} />
                    Voz
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4">
                  <Textarea
                    placeholder="Escribe tu respuesta aquí..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => setAnswers({
                      ...answers,
                      [currentQuestion.id]: e.target.value
                    })}
                    className="min-h-32"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAnswerSubmit}
                      disabled={!answers[currentQuestion.id]?.trim()}
                      className="flex items-center gap-2"
                    >
                      <Send size={16} />
                      {currentQuestionIndex < sampleQuestions.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Entrevista'}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="voice" className="space-y-4">
                  <div className="text-center space-y-4">
                    <Button
                      variant={isRecording ? "destructive" : "default"}
                      size="lg"
                      onClick={toggleRecording}
                      className="rounded-full w-16 h-16"
                    >
                      {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                    </Button>
                    <p className="text-sm text-gray-600">
                      {isRecording ? 'Grabando... Haz clic para detener' : 'Haz clic para comenzar a grabar'}
                    </p>
                    {isRecording && (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-500 text-sm">REC</span>
                      </div>
                    )}
                  </div>
                  
                  {answers[currentQuestion.id] && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="text-sm text-gray-600 block mb-2">Transcripción:</label>
                      <p className="text-gray-800">{answers[currentQuestion.id]}</p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleVoiceToText}>
                      Transcribir Audio
                    </Button>
                    <Button 
                      onClick={handleAnswerSubmit}
                      disabled={!answers[currentQuestion.id]?.trim()}
                      className="flex items-center gap-2"
                    >
                      <Send size={16} />
                      {currentQuestionIndex < sampleQuestions.length - 1 ? 'Siguiente' : 'Finalizar'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dimensiones Evaluadas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['comunicacion', 'liderazgo', 'resolucionProblemas', 'trabajoEquipo', 'adaptabilidad'].map((dimension) => (
                <div key={dimension} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{dimension.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consejos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <p>• Sé específico en tus ejemplos</p>
              <p>• Describe el contexto, acción y resultado</p>
              <p>• Habla con naturalidad</p>
              <p>• No hay respuestas correctas o incorrectas</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}