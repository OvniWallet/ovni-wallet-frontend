import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import axios from 'axios'

export function RegisterForm() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [country, setCountry] = useState('ARG')
  
  // Estado para un error general (como pérdida de conexión o fallas de servidor)
  const [generalError, setGeneralError] = useState('')
  // Estado para mapear errores específicos de cada campo que devuelva el backend
  const [apiErrors, setApiErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setGeneralError('')
    setApiErrors({})

    const hasEmptyFields =
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !country.trim()

    if (hasEmptyFields) {
      setGeneralError('Todos los campos son obligatorios.')
      return
    }

    try {
      await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        country_of_residence: country,
      })

      navigate('/login')
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data

        // Si es un error de validación del backend (ej: INVALID_INPUT)
        if (responseData.code === 'INVALID_INPUT' && Array.isArray(responseData.errors)) {
          const errorsMap: Record<string, string> = {}
          
          responseData.errors.forEach((err: { field: string; message: string }) => {
            // Guardamos el primer error asociado a cada campo
            if (!errorsMap[err.field]) {
              errorsMap[err.field] = err.message
            }
          })
          
          setApiErrors(errorsMap)
        } else {
          // Si el backend arrojó otro tipo de error controlado (ej: "Email ya registrado")
          setGeneralError(responseData.message || 'No se pudo crear la cuenta. Intentá nuevamente.')
        }
      } else {
        // En caso de que no haya conexión con el servidor
        setGeneralError('Error de conexión. Por favor, verifica tu red.')
      }
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
        {/* Campo Nombre */}
        <div>
          <label htmlFor="firstName">Nombre</label>
          <input
            id="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Tu nombre"
            autoComplete="given-name"
            style={apiErrors.first_name ? { borderColor: '#ef4444' } : {}}
          />
          {apiErrors.first_name && (
            <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {apiErrors.first_name}
            </span>
          )}
        </div>

        {/* Campo Apellido */}
        <div>
          <label htmlFor="lastName">Apellido</label>
          <input
            id="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Tu apellido"
            autoComplete="family-name"
            style={apiErrors.last_name ? { borderColor: '#ef4444' } : {}}
          />
          {apiErrors.last_name && (
            <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
              {apiErrors.last_name}
            </span>
          )}
        </div>
      </div>

      {/* Campo Correo electrónico */}
      <label htmlFor="email">Correo electrónico</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="nombre@correo.com"
        autoComplete="email"
        style={apiErrors.email ? { borderColor: '#ef4444' } : {}}
      />
      {apiErrors.email && (
        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          {apiErrors.email}
        </span>
      )}

      {/* Campo Contraseña */}
      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Creá una contraseña segura"
        autoComplete="new-password"
        style={apiErrors.password ? { borderColor: '#ef4444' } : {}}
      />
      {apiErrors.password && (
        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          {apiErrors.password}
        </span>
      )}

      {/* Campo País */}
      <label htmlFor="country">País</label>
      <input
        id="country"
        maxLength={3}
        value={country}
        onChange={(event) => setCountry(event.target.value.toUpperCase())}
        placeholder="ARG"
        style={apiErrors.country_code ? { borderColor: '#ef4444' } : {}}
      />
      {apiErrors.country_code && (
        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          {apiErrors.country_code}
        </span>
      )}

      {/* Error General */}
      {generalError && <p role="alert" style={{ color: '#ef4444', fontWeight: 'bold' }}>{generalError}</p>}

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