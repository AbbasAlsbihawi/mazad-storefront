import { create } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  /** Second line — typically the amount that was just committed. */
  detail?: string;
  /** `bid` is the brand-accented confirmation for the app's defining action. */
  variant: 'success' | 'error' | 'info' | 'bid';
}

interface ToastState {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({ toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }] })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
