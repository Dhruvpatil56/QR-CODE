'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [url, setUrl] = useState('')
  const [qr, setQr] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    setQr(null)
    setError(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-qr/?url=${encodeURIComponent(url)}`, {
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('Failed to generate QR Code')
      }

      const data = await res.json()
      setQr(data.qr_code_base64)
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">QR Code Generator</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Enter URL like https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-72 px-4 py-2 rounded text-black"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
        >
          Generate QR Code
        </button>
      </form>

      {loading && <p className="mt-4 text-yellow-400">Generating...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {qr && (
        <div className="mt-6">
          <Image
            src={`data:image/png;base64,${qr}`}
            alt="QR Code"
            width={200}
            height={200}
            className="rounded shadow-lg"
          />
        </div>
      )}
    </main>
  )
}
