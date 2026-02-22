'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type User = {
    email: string
    role: 'admin' | 'broker'
    name: string
}

type AuthContextType = {
    user: User | null
    login: (email: string, name: string) => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => { },
    logout: () => { },
    isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Check localStorage on mount
        const storedUser = localStorage.getItem('marcos_user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setIsLoading(false)
    }, [])

    const login = (email: string, name: string) => {
        // Simple simulated role logic
        const role = email.toLowerCase().includes('admin') ? 'admin' : 'broker'
        const newUser: User = { email, name, role }
        setUser(newUser)
        localStorage.setItem('marcos_user', JSON.stringify(newUser))
        router.push('/dashboard')
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('marcos_user')
        router.push('/')
    }

    // Optional: Route protection logic
    useEffect(() => {
        if (!isLoading) {
            const isAuthPage = pathname === '/login' || pathname === '/signup'
            const isDashboard = pathname?.startsWith('/dashboard')

            if (!user && isDashboard) {
                router.push('/login')
            } else if (user && isAuthPage) {
                router.push('/dashboard')
            }
        }
    }, [user, isLoading, pathname, router])

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
