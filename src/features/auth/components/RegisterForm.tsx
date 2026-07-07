import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function RegisterForm() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('ARG')
  const [timezone, setTimezone] = useState('America/Argentina/Buenos_Aires')
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !country.trim() ||
      !timezone.trim()
    ) {
      setError('Todos los campos son obligatorios.')
      return
    }

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        country_of_residence: country,
        timezone,
      })

      navigate('/login')
    } catch {
      setError('No se pudo crear la cuenta. Intenta nuevamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Crear cuenta</h1>

      <label htmlFor="firstName">Nombre</label>
      <input
        id="firstName"
        value={firstName}
        onChange={(event) => setFirstName(event.target.value)}
      />

      <label htmlFor="lastName">Apellido</label>
      <input
        id="lastName"
        value={lastName}
        onChange={(event) => setLastName(event.target.value)}
      />

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />

      <label htmlFor="country">País</label>
      <input
        id="country"
        value={country}
        onChange={(event) => setCountry(event.target.value.toUpperCase())}
      />

      <label htmlFor="timezone">Zona horaria</label>
      <input
        id="timezone"
        value={timezone}
        onChange={(event) => setTimezone(event.target.value)}
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creando cuenta...' : 'Registrarme'}
      </button>
    </form>
  )
}