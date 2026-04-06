import { create } from 'zustand'

/**
 * Toast notification store.
 * Manages a queue of toast messages with auto-dismiss.
 */
const useToastStore = create((set, get) => ({
  toasts: [],

  /**
   * Add a toast notification.
   * @param {'success' | 'error' | 'info' | 'undo'} type
   * @param {string} message
   * @param {Object} [options]
   * @param {Function} [options.onUndo] - Undo callback (for 'undo' type)
   * @param {number} [options.duration] - Auto-dismiss duration in ms (default: 4000)
   */
  addToast: (type, message, options = {}) => {
    const id = crypto.randomUUID()
    const duration = options.duration || (type === 'undo' ? 6000 : 4000)

    const toast = {
      id,
      type,
      message,
      onUndo: options.onUndo || null,
      createdAt: Date.now(),
    }

    set((state) => ({ toasts: [...state.toasts, toast] }))

    // Auto-dismiss
    setTimeout(() => {
      get().removeToast(id)
    }, duration)

    return id
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearAll: () => set({ toasts: [] }),
}))

export default useToastStore
