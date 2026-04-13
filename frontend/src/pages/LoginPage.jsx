import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

const LoginPage = () => {
  const { updateUser } = useAppContext()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'STUDENT',
    moduleAssignment: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'role' && value === 'ADMIN' ? { moduleAssignment: '' } : {})
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate authentication (in real app, this would call backend API)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const authenticatedUser = {
        username: formData.username,
        role: formData.role,
        fullName: formData.role === 'ADMIN' ? 'Admin User' : 'Student User'
      }

      // Update user in context
      updateUser(authenticatedUser)

      if (authenticatedUser.role === 'STUDENT') {
        navigate('/student/dashboard')
      } else {
        navigate('/app/dashboard')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="card-dark px-8 py-10">
          <div className="text-center mb-8">
            <div className="gradient-cyan-blue text-white font-bold text-xl px-3 py-1 rounded inline-block mb-4">
              Smart Campus
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-dark-surface border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
              >
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <Link to="/" className="text-accent-cyan hover:text-accent-blue hover:underline">
                Forgot password?
              </Link>
              <Link to="/" className="text-accent-cyan hover:text-accent-blue hover:underline">
                Sign up
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-sky-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-sky-900/30 transition-all duration-200 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>

            <div className="flex items-center gap-4 pt-1">
              <span className="h-px flex-1 bg-dark-border" />
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Continue with Google"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-dark-border bg-dark-bg text-white hover:bg-dark-border"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.5 3.9-5.5 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 3.9 1.4l2.7-2.6C17 3.4 14.7 2.5 12 2.5A9.5 9.5 0 0 0 2.5 12 9.5 9.5 0 0 0 12 21.5c5.5 0 9.1-3.8 9.1-9.2 0-.6-.1-1.1-.2-1.6H12z"/>
                    <path fill="#34A853" d="M12 21.5c2.5 0 4.5-.8 6-2.1l-2.9-2.3c-.8.5-1.8.9-3.1.9-2.4 0-4.5-1.6-5.2-3.8l-3 .2v2.3A9.5 9.5 0 0 0 12 21.5z"/>
                    <path fill="#4A90E2" d="M6.8 14.2A5.7 5.7 0 0 1 6.5 12c0-.8.1-1.5.3-2.2l-3-.2A9.5 9.5 0 0 0 2.5 12c0 1.5.4 2.9 1.1 4.1l3.2-1.9z"/>
                    <path fill="#FBBC05" d="M12 6c1.4 0 2.7.5 3.7 1.4l2.8-2.8A9.5 9.5 0 0 0 12 2.5c-3.7 0-6.9 2.1-8.4 5.2l3.2 1.9C7.5 7.6 9.6 6 12 6z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Continue with Apple"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-dark-border bg-dark-bg text-white hover:bg-dark-border"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden="true">
                    <path d="M16.37 1.43c0 1.14-.41 2.2-1.12 3-.78.88-2.05 1.56-3.24 1.46-.15-1.11.43-2.31 1.12-3.08.76-.86 2.06-1.52 3.24-1.38zM20.94 17.55c-.55 1.23-.82 1.78-1.52 2.9-.97 1.55-2.34 3.49-4.04 3.5-1.51.02-1.9-.98-3.95-.97-2.05.01-2.47.99-3.97.97-1.7-.01-2.99-1.76-3.96-3.31-2.72-4.34-3.01-9.44-1.33-12.02 1.2-1.86 3.09-2.95 4.86-2.95 1.8 0 2.93.99 4.42.99 1.44 0 2.31-.99 4.4-.99 1.58 0 3.24.86 4.44 2.35-3.91 2.15-3.28 7.74.65 9.53z"/>
                  </svg>
                </button>
              </div>
              <span className="h-px flex-1 bg-dark-border" />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
