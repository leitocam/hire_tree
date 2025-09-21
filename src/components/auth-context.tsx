import { createContext, useContext, useState, ReactNode } from 'react'

type UserRole = 'applicant' | 'company' | 'educational' | null

interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  userRole: UserRole
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  register: (email: string, password: string, name: string, role: UserRole) => Promise<boolean>
  logout: () => void
  connectWallet: (role: UserRole) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Datos simulados de usuarios
const mockUsers: User[] = [
  { id: '1', email: 'candidate@example.com', name: 'María García', role: 'applicant' },
  { id: '2', email: 'hr@techcorp.com', name: 'TechCorp HR', role: 'company' },
  { id: '3', email: 'admin@universidad.edu', name: 'Universidad Nacional', role: 'educational' }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // Simulación de login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const foundUser = mockUsers.find(u => u.email === email && u.role === role)
    if (foundUser) {
      setUser(foundUser)
      return true
    }
    return false
  }

  const register = async (email: string, password: string, name: string, role: UserRole): Promise<boolean> => {
    // Simulación de registro
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role
    }
    setUser(newUser)
    return true
  }

  const connectWallet = async (role: UserRole): Promise<boolean> => {
    // Simulación de wallet connect
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const walletUser: User = {
      id: 'wallet_' + Date.now(),
      email: 'wallet.connected@example.com',
      name: 'Usuario Wallet',
      role
    }
    setUser(walletUser)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    userRole: user?.role || null,
    login,
    register,
    logout,
    connectWallet
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}