import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastCtx = createContext(() => {});

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null);
  const timer = useRef(null);

  const toast = useCallback((text) => {
    setMsg(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(null), 2400);
  }, []);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      {msg && <div className="toast" role="status">{msg}</div>}
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
