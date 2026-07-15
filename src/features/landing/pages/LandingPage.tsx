import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bot,
  CreditCard,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react'

import logoHorizontal from '@/assets/icons/logo-horizontal.png'

const features = [
  {
    icon: Send,
    title: 'Transferencias simples',
    description:
      'Enviá dinero a otros usuarios de Ovni Wallet de forma rápida y segura.',
  },
  {
    icon: RefreshCw,
    title: 'Conversión de divisas',
    description:
      'Convertí tus balances entre distintas monedas desde una misma cuenta.',
  },
  {
    icon: CreditCard,
    title: 'Tarjetas virtuales',
    description:
      'Administrá tus tarjetas y simulá compras directamente desde la aplicación.',
  },
  {
    icon: Bot,
    title: 'Asistente inteligente',
    description:
      'Consultá información sobre tus operaciones y las funciones de Ovni Wallet.',
  },
]

export function LandingPage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <Link className="landing-brand" to="/" aria-label="Ir al inicio">
          <img src={logoHorizontal} alt="Ovni Wallet" />
        </Link>

        <nav className="landing-navigation" aria-label="Navegación principal">
          <a href="#features">Funciones</a>
          <a href="#about">Sobre Ovni Wallet</a>

          <Link className="landing-login-link" to="/login">
            Iniciar sesión
          </Link>

          <Link className="landing-header-button" to="/register">
            Abrir la app
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <p className="landing-eyebrow">Tu billetera digital</p>

          <h1>
            Tu dinero,
            <span> sin complicaciones.</span>
          </h1>

          <p className="landing-hero-description">
            Administrá tus balances, enviá dinero, convertí monedas y controlá
            tus tarjetas virtuales desde una sola aplicación.
          </p>

          <div className="landing-hero-actions">
            <Link className="landing-primary-button" to="/register">
              Crear una cuenta
              <ArrowRight size={19} />
            </Link>

            <Link className="landing-secondary-button" to="/login">
              Ya tengo una cuenta
            </Link>
          </div>

          <p className="landing-security-note">
            <ShieldCheck size={18} />
            Tus operaciones, organizadas en un solo lugar.
          </p>
        </div>

        <aside className="landing-preview" aria-label="Vista previa de Ovni Wallet">
          <p>Balance disponible</p>
          <strong>US$ 4.250,00</strong>
          <span>Actualizado recientemente</span>

          <article>
            <small>Último movimiento</small>
            <h2>Transferencia enviada</h2>
            <p>US$ 250,00</p>
            <span>Completada</span>
          </article>

          <article>
            <small>Conversión</small>
            <h2>USD a ARS</h2>
            <p>1 USD = 1.250 ARS</p>
          </article>
        </aside>
      </section>

      <section className="landing-about" id="about">
        <p className="landing-eyebrow">Todo en un solo lugar</p>

        <h2>Una billetera preparada para tus operaciones diarias.</h2>

        <p>
          Ovni Wallet reúne tus balances, transferencias, conversiones,
          movimientos y tarjetas virtuales en una experiencia sencilla,
          accesible desde computadora o celular.
        </p>
      </section>

      <section className="landing-features" id="features">
        <header>
          <p className="landing-eyebrow">Funciones principales</p>
          <h2>Herramientas para administrar mejor tu dinero.</h2>
        </header>

        <div className="landing-feature-grid">
          {features.map(({ icon: Icon, title, description }) => (
            <article className="landing-feature-card" key={title}>
              <span aria-hidden="true">
                <Icon size={24} />
              </span>

              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-final-cta">
        <div>
          <p className="landing-eyebrow">Empezá hoy</p>
          <h2>Tu dinero puede ser mucho más simple.</h2>
          <p>
            Creá tu cuenta y comenzá a administrar todas tus operaciones desde
            Ovni Wallet.
          </p>
        </div>

        <Link className="landing-primary-button" to="/register">
          Abrir Ovni Wallet
          <ArrowRight size={19} />
        </Link>
      </section>

      <footer className="landing-footer">
        <img src={logoHorizontal} alt="Ovni Wallet" />

        <p>Una experiencia simple para administrar tu dinero.</p>

        <Link to="/login">Ingresar a la aplicación</Link>
      </footer>
    </main>
  )
}