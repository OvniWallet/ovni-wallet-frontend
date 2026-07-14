import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function RegisterForm() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('ARG')
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const hasEmptyFields =
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !country.trim()

    if (hasEmptyFields) {
      setError('Todos los campos son obligatorios.')
      return
    }

    try {
    await register({
     first_name: firstName,
     last_name: lastName,
     email,
     password,
     country_code: country,
     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
   })

      navigate('/login')
    } catch {
      setError('No se pudo crear la cuenta. Intentá nuevamente.')
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <div className="auth-heading">
        <p>Creá tu cuenta</p>
        <h1>Registrarse</h1>
        <span>Completá tus datos para comenzar a usar Ovni Wallet.</span>
      </div>

      <div className="auth-fields-grid">
        <div>
          <label htmlFor="firstName">Nombre</label>
          <input
            id="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Tu nombre"
            autoComplete="given-name"
          />
        </div>

        <div>
          <label htmlFor="lastName">Apellido</label>
          <input
            id="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Tu apellido"
            autoComplete="family-name"
          />
        </div>
      </div>

      <label htmlFor="email">Correo electrónico</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="nombre@correo.com"
        autoComplete="email"
      />

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Creá una contraseña segura"
        autoComplete="new-password"
      />

      <label htmlFor="country">País</label>
      <input
        id="country"
        maxLength={3}
        value={country}
        onChange={(event) => setCountry(event.target.value.toUpperCase())}
        placeholder="ARG"
      />

      {error && <p role="alert">{error}</p>}

      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="auth-link-box">
        ¿Ya tenés una cuenta?
        <Link to="/login"> Iniciar sesión</Link>
      </p>
    </form>
  )
}