import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const BENEFITS = [
  'Gestionar tus primeros tickets de forma simple y organizada.',
  'Aprende a identificar problemas y darles seguimiento efectivo.',
  'Colabora con tu equipo y resuelve incidencias en tiempo real.',
];

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

function ProjectLogin({ onBack, onLogin }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Iniciar sesión | Proyecto A';

    return () => {
      document.title = previousTitle;
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

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

    onLogin(email);
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

      <section className="login-form-panel" aria-label="Inicio de sesión de Proyecto A">
        <button className="login-back" type="button" onClick={onBack}>
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
            <path d="m12 4-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Mis proyectos
        </button>

        <div className="login-form-wrap">
          <p className="login-project-label">Proyecto A</p>
          <h2>Iniciar sesión</h2>
          <p className="login-subtitle">Accede a tu cuenta empresarial Unisys Training</p>

          <form className="login-form" noValidate onSubmit={handleSubmit}>
            <label className="login-field-label" htmlFor="login-email">Usuario</label>
            <input
              autoComplete="username"
              className="login-input"
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
                id="login-password"
                name="password"
                required
                type={isPasswordVisible ? 'text' : 'password'}
              />
              <button
                aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="password-visibility"
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
              <label className="remember-option">
                <input type="checkbox" name="remember" />
                <span>Recordarme</span>
              </label>
              <button
                className="forgot-password"
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
            <button className="login-submit" type="submit">Iniciar sesión</button>

            <div className="login-security-note">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
                <rect x="4" y="8" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M6.5 8V5.8a3.5 3.5 0 0 1 7 0V8" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="10" cy="12.5" r=".9" fill="currentColor" />
              </svg>
              <span>Acceso de Proyecto A. La autenticación aún no está conectada.</span>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ProjectLogin;