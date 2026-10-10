import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const ToastContext = createContext();

// Picks a colour for the message automatically
const guessType = (message) => {
  const text = String(message).toLowerCase();

  const bad =
    /(fail|error|invalid|cannot|could not|not enough|no longer|only|please|reached|denied|expired|declined|do not match|required)/;

  const good =
    /(success|added|saved|placed|updated|cancelled|removed|moved|thank|applied)/;

  if (bad.test(text)) return "error";
  if (good.test(text)) return "success";

  return "info";
};

const ICONS = {
  success: "✓",
  error: "!",
  info: "i",
};

export function ToastProvider({ children }) {

  const [toasts, setToasts] = useState([]);

  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    (message, type) => {

      const id = ++idRef.current;

      const text = String(message);

      setToasts((current) => [
        ...current.slice(-3),
        {
          id,
          message: text,
          type: type || guessType(text),
        },
      ]);

      // Longer messages stay a little longer
      const duration = Math.min(
        7000,
        3500 + text.length * 20
      );

      setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  // Every alert("...") in the whole site now shows a
  // toast instead of the browser alert box.
  useEffect(() => {

    const originalAlert = window.alert;

    window.alert = (message) => showToast(message);

    return () => {
      window.alert = originalAlert;
    };
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>

      {children}

      <div
        className="toast-container"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <button
            type="button"
            key={toast.id}
            className={`toast toast-${toast.type}`}
            onClick={() => dismiss(toast.id)}
            title="Click to dismiss"
          >
            <span className="toast-icon">
              {ICONS[toast.type]}
            </span>

            <span className="toast-text">
              {toast.message}
            </span>
          </button>
        ))}
      </div>

    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
