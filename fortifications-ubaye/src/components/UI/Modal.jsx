import { useEffect } from 'react'

export default function Modal({ open, onClose, children, side = false }) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  if (side) {
    // Side panel (slides in from right on desktop, from bottom on mobile)
    return (
      <div className="fixed inset-0 z-[800] flex">
        <div
          className="flex-1 bg-black/20"
          onClick={onClose}
        />
        <div className="w-full sm:w-[420px] bg-parchment-50 shadow-2xl border-l border-stone-200 flex flex-col overflow-y-auto animate-slide-in">
          {children}
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-[800] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative z-10 w-full sm:max-w-lg bg-parchment-50 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
