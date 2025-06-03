import React, { createContext, useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axios'

const usercontext = createContext()

const Authcontext = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || null))
  const navigate = useNavigate()

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await axiosInstance.get('/api/auth/verify');

          if (response.data.success) {
            setUser(response.data.user)
            localStorage.setItem("user", JSON.stringify(response.data.user))
          }
        } else {
          setUser(null)
          localStorage.removeItem("user")
        }
      } catch (error) {
        if (error.response && !error.response.data.error) {
          setUser(null)
          localStorage.removeItem("user")
        }
      }
    }
    verifyUser()
  }, [])

  const login = (user) => {
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <usercontext.Provider value={{ user, login, logout }}>
      {children}
    </usercontext.Provider>
  )
}

export const useAuth = () => useContext(usercontext)
export default Authcontext
