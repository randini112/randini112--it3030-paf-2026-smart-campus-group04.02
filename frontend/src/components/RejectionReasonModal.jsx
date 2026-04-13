import React, { useEffect, useState } from 'react'

const RejectionReasonModal = ({ isOpen, booking, isSubmitting, onCancel, onConfirm }) => {
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setReason('')
    }
  }, [isOpen])

  if (!isOpen || !booking) {
    return null
  }

  const handleSubmit = () => {
    if (!reason.trim()) {
      return
    }

    onConfirm(booking.id, reason.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-dark-border bg-dark-surface p-6 shadow-2xl">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Mandatory audit reason</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Reject booking request</h2>
          <p className="mt-2 text-sm text-gray-400">
            {booking.resourceName} requested by {booking.userId}. Provide a reason to continue.
          </p>
        </div>

        <label className="mb-2 block text-sm font-medium text-gray-300">
          Reason <span className="text-red-400">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={5}
          className="w-full rounded-lg border border-dark-border bg-dark-bg px-3 py-2 text-white outline-none focus:ring-2 focus:ring-accent-cyan"
          placeholder="Explain why this booking is being rejected"
        />

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-dark-border px-4 py-2 text-sm text-gray-300 hover:bg-dark-border"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Rejecting...' : 'Reject Booking'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RejectionReasonModal