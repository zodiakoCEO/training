import { useEffect, useRef, useState } from 'react';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function CreateProjectModal({ project, onClose, onSave }) {
  const isEditing = Boolean(project);
  const [name, setName] = useState(project?.name ?? '');
  const [imageUrl, setImageUrl] = useState(project?.imageUrl ?? '');
  const [imageError, setImageError] = useState('');
  const nameInputRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    nameInputRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    setImageError('');

    if (!file) {
      setImageUrl('');
      return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageUrl('');
      setImageError('Usa una imagen en formato PNG, JPG o WEBP.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageUrl('');
      setImageError('La imagen debe pesar menos de 5 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      } else {
        setImageError('No se pudo leer la imagen. Intenta con otro archivo.');
      }
    };
    reader.onerror = () => {
      setImageUrl('');
      setImageError('No se pudo leer la imagen. Intenta con otro archivo.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      nameInputRef.current?.setCustomValidity('Escribe un nombre para el proyecto.');
      nameInputRef.current?.reportValidity();
      return;
    }

    onSave({
      name: name.trim(),
      imageUrl,
    });
  };

  return (
    <div
      className="project-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <section
        aria-labelledby="create-project-title"
        aria-modal="true"
        className="project-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="project-modal-header">
          <div>
            <p className="project-modal-eyebrow">{isEditing ? 'Detalles del proyecto' : 'Nuevo espacio de trabajo'}</p>
            <h2 id="create-project-title">{isEditing ? 'Editar proyecto' : 'Crear proyecto'}</h2>
            <p className="project-modal-intro">
              {isEditing ? 'Actualiza el nombre o la imagen de portada.' : 'Elige un nombre y una imagen para identificarlo.'}
            </p>
          </div>
          <button
            aria-label="Cerrar"
            className="project-modal-close"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form className="project-modal-form" onSubmit={handleSubmit}>
          <label className="project-modal-label" htmlFor="project-name">
            Nombre del proyecto
          </label>
          <input
            ref={nameInputRef}
            autoComplete="off"
            className="project-modal-input"
            id="project-name"
            maxLength={60}
            onChange={(event) => {
              event.target.setCustomValidity('');
              setName(event.target.value);
            }}
            placeholder="Ej. Atención al cliente"
            required
            value={name}
          />

          <label className="project-modal-label" htmlFor="project-image">
            Imagen de fondo <span>(opcional)</span>
          </label>
          <label className={`project-image-picker${imageUrl ? ' project-image-picker--selected' : ''}`} htmlFor="project-image">
            {imageUrl ? (
              <>
                <img alt="Vista previa de la portada" src={imageUrl} />
                <span className="project-image-overlay">Cambiar imagen</span>
              </>
            ) : (
              <>
                <span className="project-image-icon" aria-hidden="true">↑</span>
                <span className="project-image-title">Elige una imagen</span>
                <span className="project-image-hint">PNG, JPG o WEBP · Máximo 5 MB</span>
              </>
            )}
            <input
              accept="image/png,image/jpeg,image/webp"
              className="project-image-input"
              id="project-image"
              onChange={handleImageChange}
              type="file"
            />
          </label>
          {imageUrl && (
            <button
              className="project-image-remove"
              onClick={() => {
                setImageUrl('');
                setImageError('');
                const input = document.getElementById('project-image');
                if (input instanceof HTMLInputElement) {
                  input.value = '';
                }
              }}
              type="button"
            >
              Quitar imagen
            </button>
          )}
          {imageError && <p className="project-image-error" role="alert">{imageError}</p>}

          <div className="project-modal-actions">
            <button className="project-modal-cancel" onClick={onClose} type="button">
              Cancelar
            </button>
            <button className="project-modal-submit" type="submit">
              {isEditing ? 'Guardar cambios' : 'Crear proyecto'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateProjectModal;
