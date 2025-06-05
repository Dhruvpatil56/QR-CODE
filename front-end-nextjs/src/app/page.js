'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [url, setUrl] = useState('')
  const [qr, setQr] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!url) return
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate-qr/?url=${encodeURIComponent(url)}`, {
        method: 'POST',
      })
      const data = await res.json()
      setQr(data.qr_code_base64)
    } catch (error) {
      console.error('Error generating QR Code:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">QR Code Generator</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleGenerate} className="bg-blue-500 text-white px-4 py-2 rounded">
          Generate
        </button>
      </div>

      {loading && <p>Generating...</p>}

      {qr && (
        <div className="mt-4">
          <Image
            src={`data:image/png;base64,${qr}`}
            alt="QR Code"
            width={200}
            height={200}
          />
        </div>
      )}
    </main>
  )
}
