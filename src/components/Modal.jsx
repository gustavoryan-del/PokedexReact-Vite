import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import '../css/Modal.css';

const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Janela modal acessível: fecha com Esc ou clique fora, trava a rolagem da página,
 * mantém o foco dentro da janela e devolve o foco ao elemento anterior ao fechar.
 */
export function Modal({ labelledBy, onClose, className = '', children }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    dialog.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = Array.from(dialog.querySelectorAll(FOCUSABLE));
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === dialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return createPortal(
    <div className="modal-overlay" onMouseDown={handleOverlayMouseDown}>
      <div
        ref={dialogRef}
        className={`modal-content ${className}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

export function ModalHeader({ titleId, title, tag, onClose }) {
  return (
    <header className="modal-header">
      <span className="mini-lens" aria-hidden="true" />
      <span className="mini-leds" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <h2 id={titleId} className="modal-title">
        {title}
      </h2>
      {tag && <span className="modal-tag">{tag}</span>}
      <button type="button" className="close-button" onClick={onClose} aria-label="Fechar">
        ×
      </button>
    </header>
  );
}
