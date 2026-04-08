'use client'

import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if on iOS
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )

    // Check if already installed
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    // Show prompt if not installed
    if (!window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(true)
    }
  }, [])

  if (isStandalone || !showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
      <p className="font-semibold mb-2">📱 Install Hisn Muslim</p>

      {isIOS ? (
        <div className="text-sm">
          <p>1. Tap the share button <span className="text-xl">⎋</span></p>
          <p>2. Select "Add to Home Screen" <span className="text-xl">➕</span></p>
          <p>3. Tap "Add" in the top right</p>
        </div>
      ) : (
        <div className="text-sm">
          <p>Tap the menu button and select "Install" or "Add to Home Screen"</p>
        </div>
      )}

      <button
        onClick={() => setShowPrompt(false)}
        className="mt-3 bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-semibold"
      >
        Close
      </button>
    </div>
  )
}