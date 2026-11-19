import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { isDemoLoginEnabled, loginUser } from '../services/api.js';

const BENEFITS = [
  'Gestionar tus primeros tickets de forma simple y organizada.',
  'Aprende a identificar problemas y darles seguimiento efectivo.',
  'Colabora con tu equipo y resuelve incidencias en tiempo real.',
];

const MIN_LOGIN_LOADING_MS = 2000;

const LOGIN_ALERT_OPTIONS = {
  width: '360px',
  padding: '1.25rem',
  confirmButtonText: 'Entendido',
  buttonsStyling: false,
  customClass: {
    popup: 'login-alert-popup',
    icon: 'login-alert-icon',
    title: 'login-alert-title',
    htmlContainer: 'login-alert-message',
    confirmButton: 'login-alert-confirm',
  },
};

async function waitForMinimumLoginFeedback(startedAt) {
  const remainingMs = MIN_LOGIN_LOADING_MS - (Date.now() - startedAt);
  if (remainingMs > 0) {
    await new Promise((resolve) => window.setTimeout(resolve, remainingMs));
  }
}

function ProjectLogin({ onBack, onLogin }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Iniciar sesión | Bancolombia';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const emailInput = form.elements.namedItem('email');
    const email = emailInput.value.trim();
    const password = form.elements.namedItem('password').value;

    if (!email) {
      Swal.fire({
        ...LOGIN_ALERT_OPTIONS,
        icon: 'warning',
        iconColor: '#ad741e',
        title: 'Falta tu usuario',
        text: 'Ingresa tu correo electrónico para continuar.',
      });
      return;
    }

    if (emailInput.validity.typeMismatch || !email.includes('@')) {
      Swal.fire({
        ...LOGIN_ALERT_OPTIONS,
        icon: 'warning',
        iconColor: '#ad741e',
        title: 'Correo electrónico inválido',
        text: 'Verifica que tu correo tenga un formato válido e incluya el símbolo @.',
      });
      return;
    }

    if (!password) {
      Swal.fire({
        ...LOGIN_ALERT_OPTIONS,
        icon: 'warning',
        iconColor: '#ad741e',
        title: 'Falta tu contraseña',
        text: 'Ingresa tu contraseña para continuar.',
      });
      return;
    }

    setIsSubmitting(true);
    const loadingStartedAt = Date.now();
    try {
      const user = await loginUser(email, password);
      await waitForMinimumLoginFeedback(loadingStartedAt);
      onLogin(user);
    } catch (error) {
      await waitForMinimumLoginFeedback(loadingStartedAt);
      Swal.fire({
        ...LOGIN_ALERT_OPTIONS,
        icon: error.message === 'Correo o contrasena incorrectos' ? 'warning' : 'error',
        iconColor: error.message === 'Correo o contrasena incorrectos' ? '#ad741e' : '#b42318',
        title: error.message === 'Correo o contrasena incorrectos'
          ? 'Credenciales incorrectas'
          : 'No fue posible iniciar sesión',
        text: error.message === 'Correo o contrasena incorrectos'
          ? 'Verifica tu correo y contraseña e inténtalo nuevamente.'
          : 'No se pudo conectar con el servidor. Inténtalo más tarde.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-brand-panel" aria-label="Unisys Training">
        <span className="login-brand">
          Unisys Training
        </span>

        <div className="login-brand-copy">
          <h1>
            Gestión digital <span>segura e inteligente</span>
          </h1>
          <p className="login-intro">
            Unisys Training, herramienta diseñada para acompañarte en este proceso.
          </p>
          <ul className="login-benefits">
            {BENEFITS.map((benefit) => (
              <li key={benefit}>
                <span className="benefit-check" aria-hidden="true">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="login-copyright">
          © 2025 Unisys Training. Todos los derechos reservados.
        </p>
      </section>

      <section className="login-form-panel" aria-label="Inicio de sesión de Bancolombia">
        <button className="login-back" type="button" onClick={onBack}>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
            <path d="m12 4-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg> 
          
          Mis proyectos
        </button>

        <div className="login-form-wrap">
          <p className="login-project-label">Bancolombia</p>
          <h2>Iniciar sesión</h2>
          <p className="login-subtitle">Accede a tu cuenta empresarial Unisys Training</p>

          <form aria-busy={isSubmitting} className="login-form" noValidate onSubmit={handleSubmit}>
            <label className="login-field-label" htmlFor="login-email">Usuario</label>
            <input
              autoComplete="username"
              className="login-input"
              disabled={isSubmitting}
              id="login-email"
              name="email"
              placeholder="nombre.apellido@unisys.com"
              required
              type="email"
            />

            <label className="login-field-label login-password-label" htmlFor="login-password">
              Contraseña
            </label>
            <div className="login-password-wrap">
              <input
                autoComplete="current-password"
                className="login-input"
                disabled={isSubmitting}
                id="login-password"
                name="password"
                required
                type={isPasswordVisible ? 'text' : 'password'}
              />
              <button
                aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="password-visibility"
                disabled={isSubmitting}
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                type="button"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.7" />
                  <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.7" />
                </svg>
              </button>
            </div>

            <div className="login-options">
              <button
                className="forgot-password"
                disabled={isSubmitting}
                onClick={() => Swal.fire({
                  ...LOGIN_ALERT_OPTIONS,
                  icon: 'info',
                  iconColor: '#1b8175',
                  title: 'Recuperación de contraseña',
                  text: 'La recuperación de contraseña aún no está configurada.',
                })}
                type="button"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <button className="login-submit" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Validando...' : 'Iniciar sesión'}
            </button>
            {isSubmitting && (
              <div aria-live="polite" className="login-progress" role="status">
                <span aria-hidden="true" className="login-spinner" />
                <span>Validando tus credenciales...</span>
              </div>
            )}

            <div className="login-security-note">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                <rect x="4" y="8" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M6.5 8V5.8a3.5 3.5 0 0 1 7 0V8" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="10" cy="12.5" r=".9" fill="currentColor" />
              </svg>
              <span>
                {isDemoLoginEnabled
                  ? 'Modo de demostración: los cambios no se guardan y no se conecta al backend.'
                  : 'La cuenta de prueba permite acceder sin backend; sus cambios no se guardan.'}
              </span>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ProjectLogin;