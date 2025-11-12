'use client'

import { useState, useEffect } from 'react'
import { Heart, Phone, MessageCircle, Calendar, Target, Shield, Users, BookOpen, Clock, AlertTriangle, Trophy, BarChart3, Play, Pause, RotateCcw, Gamepad2, Brain, Zap, Star, TrendingUp, Award, ChevronRight } from 'lucide-react'

interface UserStats {
  daysClean: number
  gameTime: number // em minutos
  otherActivitiesTime: number // em minutos
  weeklyGoal: number // em dias
  totalPoints: number
  level: number
}

interface RankingUser {
  id: number
  name: string
  daysClean: number
  points: number
  level: number
  avatar: string
}

export default function RecoveryApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ranking' | 'games' | 'emergency'>('dashboard')
  const [daysClean, setDaysClean] = useState(0)
  const [lastResetDate, setLastResetDate] = useState<string>('')
  const [showEmergency, setShowEmergency] = useState(false)
  const [showReflection, setShowReflection] = useState(false)
  const [currentReflection, setCurrentReflection] = useState('')
  const [gameTimer, setGameTimer] = useState(0) // em segundos
  const [isGameTimerRunning, setIsGameTimerRunning] = useState(false)
  const [otherActivitiesTimer, setOtherActivitiesTimer] = useState(0)
  const [isOtherActivitiesRunning, setIsOtherActivitiesRunning] = useState(false)
  const [weeklyGoal, setWeeklyGoal] = useState(7)
  const [userStats, setUserStats] = useState<UserStats>({
    daysClean: 0,
    gameTime: 0,
    otherActivitiesTime: 0,
    weeklyGoal: 7,
    totalPoints: 0,
    level: 1
  })

  const reflections = [
    "Lembre-se: cada dia limpo é uma vitória. Você é mais forte do que imagina.",
    "O dinheiro perdido pode ser recuperado, mas sua paz mental é inestimável.",
    "Você não está sozinho nesta jornada. Milhões de pessoas passaram por isso.",
    "Cada 'não' que você diz aos jogos é um 'sim' para sua liberdade.",
    "Sua família e amigos acreditam em você. Acredite em si mesmo também.",
    "O vício quer que você acredite que não há saída. Isso é mentira.",
    "Você já teve a coragem de buscar ajuda. Isso mostra sua força interior.",
    "Cada momento difícil que você supera te torna mais resiliente."
  ]

  const emergencyContacts = [
    { name: "CVV - Centro de Valorização da Vida", phone: "188", description: "24h gratuito" },
    { name: "CAPS - Centro de Atenção Psicossocial", phone: "136", description: "Saúde mental" },
    { name: "Jogadores Anônimos", phone: "(11) 3229-4111", description: "Grupo de apoio" }
  ]

  const rankingUsers: RankingUser[] = [
    { id: 1, name: "Ana Silva", daysClean: 45, points: 2250, level: 8, avatar: "👩" },
    { id: 2, name: "Carlos Santos", daysClean: 38, points: 1900, level: 7, avatar: "👨" },
    { id: 3, name: "Maria Oliveira", daysClean: 32, points: 1600, level: 6, avatar: "👩‍🦱" },
    { id: 4, name: "João Costa", daysClean: 28, points: 1400, level: 5, avatar: "👨‍🦲" },
    { id: 5, name: "Você", daysClean: daysClean, points: userStats.totalPoints, level: userStats.level, avatar: "🫵" }
  ]

  const alternativeGames = [
    {
      title: "Quebra-cabeça Zen",
      description: "Relaxe montando puzzles calmos",
      icon: "🧩",
      category: "Relaxamento",
      color: "from-blue-400 to-cyan-500"
    },
    {
      title: "Meditação Guiada",
      description: "5 minutos de paz interior",
      icon: "🧘‍♂️",
      category: "Mindfulness",
      color: "from-green-400 to-emerald-500"
    },
    {
      title: "Quiz de Conhecimento",
      description: "Teste seus conhecimentos gerais",
      icon: "🧠",
      category: "Educativo",
      color: "from-purple-400 to-pink-500"
    },
    {
      title: "Exercícios Rápidos",
      description: "Movimente-se por 10 minutos",
      icon: "💪",
      category: "Físico",
      color: "from-orange-400 to-red-500"
    },
    {
      title: "Diário Gratidão",
      description: "Escreva 3 coisas boas do dia",
      icon: "📝",
      category: "Reflexão",
      color: "from-yellow-400 to-orange-500"
    },
    {
      title: "Respiração 4-7-8",
      description: "Técnica para reduzir ansiedade",
      icon: "🌬️",
      category: "Relaxamento",
      color: "from-teal-400 to-blue-500"
    }
  ]

  useEffect(() => {
    const savedDate = localStorage.getItem('lastResetDate')
    const savedDays = localStorage.getItem('daysClean')
    const savedStats = localStorage.getItem('userStats')
    
    if (savedDate && savedDays) {
      const lastDate = new Date(savedDate)
      const today = new Date()
      const diffTime = Math.abs(today.getTime() - lastDate.getTime())
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      const newDaysClean = parseInt(savedDays) + diffDays
      setDaysClean(newDaysClean)
      setLastResetDate(savedDate)
      
      if (savedStats) {
        const stats = JSON.parse(savedStats)
        const newStats = {
          ...stats,
          daysClean: newDaysClean,
          totalPoints: newDaysClean * 50 + stats.gameTime * 2 + stats.otherActivitiesTime * 3,
          level: Math.floor((newDaysClean * 50 + stats.gameTime * 2 + stats.otherActivitiesTime * 3) / 500) + 1
        }
        setUserStats(newStats)
        localStorage.setItem('userStats', JSON.stringify(newStats))
      }
    } else {
      const today = new Date().toISOString().split('T')[0]
      setLastResetDate(today)
      localStorage.setItem('lastResetDate', today)
      localStorage.setItem('daysClean', '0')
    }
  }, [])

  // Timer para jogos alternativos
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isGameTimerRunning) {
      interval = setInterval(() => {
        setGameTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isGameTimerRunning])

  // Timer para outras atividades
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isOtherActivitiesRunning) {
      interval = setInterval(() => {
        setOtherActivitiesTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isOtherActivitiesRunning])

  const resetCounter = () => {
    const today = new Date().toISOString().split('T')[0]
    setDaysClean(0)
    setLastResetDate(today)
    localStorage.setItem('lastResetDate', today)
    localStorage.setItem('daysClean', '0')
    
    const newStats = { ...userStats, daysClean: 0, totalPoints: 0, level: 1 }
    setUserStats(newStats)
    localStorage.setItem('userStats', JSON.stringify(newStats))
  }

  const showRandomReflection = () => {
    const randomIndex = Math.floor(Math.random() * reflections.length)
    setCurrentReflection(reflections[randomIndex])
    setShowReflection(true)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getBalancePercentage = () => {
    const totalTime = userStats.gameTime + userStats.otherActivitiesTime
    if (totalTime === 0) return { games: 50, activities: 50 }
    
    const gamesPercent = Math.round((userStats.gameTime / totalTime) * 100)
    const activitiesPercent = 100 - gamesPercent
    
    return { games: gamesPercent, activities: activitiesPercent }
  }

  const saveTimerData = (type: 'game' | 'activity', seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const newStats = {
      ...userStats,
      [type === 'game' ? 'gameTime' : 'otherActivitiesTime']: userStats[type === 'game' ? 'gameTime' : 'otherActivitiesTime'] + minutes
    }
    newStats.totalPoints = newStats.daysClean * 50 + newStats.gameTime * 2 + newStats.otherActivitiesTime * 3
    newStats.level = Math.floor(newStats.totalPoints / 500) + 1
    
    setUserStats(newStats)
    localStorage.setItem('userStats', JSON.stringify(newStats))
  }

  const balance = getBalancePercentage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-blue-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Recomeço</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sua jornada de recuperação</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Nível {userStats.level}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-b border-blue-100 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'ranking', label: 'Ranking', icon: Trophy },
              { id: 'games', label: 'Jogos', icon: Gamepad2 },
              { id: 'emergency', label: 'SOS', icon: AlertTriangle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Contador Principal e Estatísticas */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {daysClean} {daysClean === 1 ? 'dia' : 'dias'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">sem apostar ou jogar</p>
                {lastResetDate && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Desde {formatDate(lastResetDate)}
                  </p>
                )}
                <button
                  onClick={resetCounter}
                  className="mt-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Recomeçar contador
                </button>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Meta Semanal
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {Math.min(daysClean, weeklyGoal)}/{weeklyGoal} dias
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((daysClean / weeklyGoal) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={weeklyGoal}
                      onChange={(e) => setWeeklyGoal(parseInt(e.target.value) || 7)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100"
                      min="1"
                      max="30"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">dias</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de Equilíbrio */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Equilíbrio de Atividades
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-red-500 font-medium">Jogos Alternativos ({balance.games}%)</span>
                  <span className="text-green-500 font-medium">Outras Atividades ({balance.activities}%)</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                  <div className="h-full flex">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-orange-500 transition-all duration-500"
                      style={{ width: `${balance.games}%` }}
                    ></div>
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                      style={{ width: `${balance.activities}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{userStats.gameTime}min</p>
                    <p className="text-sm text-red-500">Jogos Alternativos</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{userStats.otherActivitiesTime}min</p>
                    <p className="text-sm text-green-500">Outras Atividades</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timers */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-orange-500" />
                  Timer - Jogos Alternativos
                </h3>
                
                <div className="text-center space-y-4">
                  <div className="text-3xl font-mono font-bold text-orange-600 dark:text-orange-400">
                    {formatTime(gameTimer)}
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setIsGameTimerRunning(!isGameTimerRunning)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isGameTimerRunning 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isGameTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (gameTimer > 0) {
                          saveTimerData('game', gameTimer)
                        }
                        setGameTimer(0)
                        setIsGameTimerRunning(false)
                      }}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-500" />
                  Timer - Outras Atividades
                </h3>
                
                <div className="text-center space-y-4">
                  <div className="text-3xl font-mono font-bold text-green-600 dark:text-green-400">
                    {formatTime(otherActivitiesTimer)}
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => setIsOtherActivitiesRunning(!isOtherActivitiesRunning)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isOtherActivitiesRunning 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isOtherActivitiesRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => {
                        if (otherActivitiesTimer > 0) {
                          saveTimerData('activity', otherActivitiesTimer)
                        }
                        setOtherActivitiesTimer(0)
                        setIsOtherActivitiesRunning(false)
                      }}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de Ação Rápida */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowEmergency(true)}
                className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-105"
              >
                <AlertTriangle className="w-8 h-8" />
                <span className="font-medium">SOS</span>
                <span className="text-xs opacity-90">Preciso de ajuda agora</span>
              </button>
              
              <button
                onClick={showRandomReflection}
                className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl flex flex-col items-center gap-2 transition-all hover:scale-105"
              >
                <BookOpen className="w-8 h-8" />
                <span className="font-medium">Reflexão</span>
                <span className="text-xs opacity-90">Palavras de apoio</span>
              </button>
            </div>
          </div>
        )}

        {/* Ranking Tab */}
        {activeTab === 'ranking' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Ranking da Comunidade
              </h3>
              
              <div className="space-y-3">
                {rankingUsers
                  .sort((a, b) => b.points - a.points)
                  .map((user, index) => (
                    <div 
                      key={user.id}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        user.name === 'Você' 
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700' 
                          : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-600 text-white' :
                          'bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="text-2xl">{user.avatar}</span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800 dark:text-gray-100">{user.name}</h4>
                          {index < 3 && <Award className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.daysClean} dias limpo • Nível {user.level}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{user.points}</p>
                        <p className="text-xs text-gray-500">pontos</p>
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  Como ganhar pontos
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 50 pontos por dia limpo</li>
                  <li>• 2 pontos por minuto de jogo alternativo</li>
                  <li>• 3 pontos por minuto de outras atividades</li>
                  <li>• Bônus de nível a cada 500 pontos</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Games Tab */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-green-500" />
                Jogos Alternativos Saudáveis
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Atividades que ajudam a reduzir a ansiedade e ocupar a mente de forma positiva
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alternativeGames.map((game, index) => (
                  <div 
                    key={index}
                    className="group cursor-pointer"
                    onClick={() => {
                      // Aqui você pode integrar com jogos reais ou iniciar timer
                      setIsGameTimerRunning(true)
                      alert(`Iniciando: ${game.title}`)
                    }}
                  >
                    <div className={`bg-gradient-to-br ${game.color} p-6 rounded-xl text-white transition-all group-hover:scale-105 group-hover:shadow-lg`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl">{game.icon}</span>
                        <ChevronRight className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </div>
                      
                      <h4 className="font-bold text-lg mb-2">{game.title}</h4>
                      <p className="text-sm opacity-90 mb-3">{game.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                          {game.category}
                        </span>
                        <Zap className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                      Dica Importante
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Estes jogos são projetados para serem relaxantes e não viciantes. 
                      Use o timer para controlar o tempo e manter o equilíbrio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Tab */}
        {activeTab === 'emergency' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Phone className="w-6 h-6 text-red-500" />
                Contatos de Emergência
              </h3>
              
              <div className="space-y-3 mb-6">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{contact.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{contact.description}</p>
                      </div>
                      <a 
                        href={`tel:${contact.phone}`}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Lembre-se:</strong> Este momento difícil vai passar. Você já superou outros desafios antes e pode superar este também.
                </p>
              </div>

              <button
                onClick={showRandomReflection}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Palavras de Apoio
              </button>
            </div>
          </div>
        )}

        {/* Mensagem Motivacional */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white text-center">
          <h3 className="text-lg font-bold mb-2">Você é mais forte que o vício</h3>
          <p className="text-indigo-100">
            Cada momento que você resiste é um passo em direção à sua liberdade. 
            Sua vida vale mais que qualquer aposta.
          </p>
        </div>
      </div>

      {/* Modal de Emergência */}
      {showEmergency && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Phone className="w-6 h-6 text-red-500" />
              Contatos de Emergência
            </h3>
            
            <div className="space-y-3 mb-6">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{contact.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{contact.description}</p>
                    </div>
                    <a 
                      href={`tel:${contact.phone}`}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Lembre-se:</strong> Este momento difícil vai passar. Você já superou outros desafios antes e pode superar este também.
              </p>
            </div>
            
            <button
              onClick={() => setShowEmergency(false)}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Reflexão */}
      {showReflection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-500" />
              Momento de Reflexão
            </h3>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                {currentReflection}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={showRandomReflection}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
              >
                Outra reflexão
              </button>
              <button
                onClick={() => setShowReflection(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}