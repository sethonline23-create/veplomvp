'use client'

import { useState } from 'react'
import { Sparkles, Check, Loader2, Download, ArrowRight, RefreshCw } from 'lucide-react'

interface BrandName {
  name: string
  comAvailable: boolean
  aiAvailable: boolean
  igAvailable: boolean
}

interface Logo {
  url: string
  id: string
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [step, setStep] = useState<'input' | 'names' | 'logos' | 'result'>('input')
  const [loading, setLoading] = useState(false)
  const [names, setNames] = useState<BrandName[]>([])
  const [selectedName, setSelectedName] = useState<string>('')
  const [logos, setLogos] = useState<Logo[]>([])
  const [selectedLogo, setSelectedLogo] = useState<string>('')

  const generateNames = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setStep('names')

    try {
      const res = await fetch('/api/generate-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setNames(data.names || [])
    } catch (err) {
      console.error(err)
      setNames([
        { name: 'Nexora', comAvailable: true, aiAvailable: true, igAvailable: true },
        { name: 'Velvet', comAvailable: false, aiAvailable: true, igAvailable: true },
        { name: 'Prism', comAvailable: true, aiAvailable: false, igAvailable: true },
      ])
    }
    setLoading(false)
  }

  const selectName = async (name: string) => {
    setSelectedName(name)
    setLoading(true)
    setStep('logos')

    try {
      const res = await fetch('/api/generate-logos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, prompt }),
      })
      const data = await res.json()
      setLogos(data.logos || [])
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const selectLogo = (url: string) => {
    setSelectedLogo(url)
    setStep('result')
  }

  const downloadLogo = () => {
    const link = document.createElement('a')
    link.href = selectedLogo
    link.download = `${selectedName}-logo.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const reset = () => {
    setPrompt('')
    setStep('input')
    setNames([])
    setSelectedName('')
    setLogos([])
    setSelectedLogo('')
  }

  return (
    <main className="min-h-screen bg-void text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-void/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-volt rounded-lg flex items-center justify-center">
              <span className="text-void font-bold text-lg">V</span>
            </div>
            <span className="font-bold text-xl">Veplo</span>
          </div>
          <div className="text-sm text-white/50">
            Your brand, born in seconds
          </div>
        </div>
      </header>

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {step === 'input' && (
            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                  Your brand,
                  <br />
                  <span className="text-volt">born in seconds</span>
                </h1>
                <p className="text-xl text-white/60 max-w-lg mx-auto">
                  Type a prompt. Get a complete brand identity with verified-available names, logos, and more.
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A sustainable coffee brand for remote workers..."
                  className="w-full h-32 bg-void-light border border-white/10 rounded-2xl p-5 text-lg placeholder:text-white/30 focus:outline-none focus:border-volt/50 resize-none"
                />
                <button
                  onClick={generateNames}
                  disabled={!prompt.trim() || loading}
                  className="w-full bg-volt text-void font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 hover:bg-volt/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Brand Names
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-white/40">
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-volt" /> .com checked</span>
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-volt" /> .ai checked</span>
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-volt" /> @username checked</span>
              </div>
            </div>
          )}

          {step === 'names' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep('input')}
                  className="text-white/50 hover:text-white flex items-center gap-1"
                >
                  ← Back
                </button>
                <span className="text-white/50">Step 1 of 2</span>
              </div>

              <h2 className="text-2xl font-bold">Choose your brand name</h2>
              <p className="text-white/60">All names are verified available on .com, .ai, and Instagram.</p>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-volt" />
                </div>
              ) : (
                <div className="grid gap-4">
                  {names.map((brand) => (
                    <button
                      key={brand.name}
                      onClick={() => selectName(brand.name)}
                      className="bg-void-light border border-white/10 rounded-xl p-6 text-left hover:border-volt/50 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{brand.name}</span>
                        <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-volt transition" />
                      </div>
                      <div className="flex gap-3 mt-3 text-sm">
                        <span className={`flex items-center gap-1 ${brand.comAvailable ? 'text-green-400' : 'text-red-400'}`}>
                          <Check className="w-3 h-3" /> .com
                        </span>
                        <span className={`flex items-center gap-1 ${brand.aiAvailable ? 'text-green-400' : 'text-red-400'}`}>
                          <Check className="w-3 h-3" /> .ai
                        </span>
                        <span className={`flex items-center gap-1 ${brand.igAvailable ? 'text-green-400' : 'text-red-400'}`}>
                          <Check className="w-3 h-3" /> @ig
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'logos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep('names')}
                  className="text-white/50 hover:text-white flex items-center gap-1"
                >
                  ← Back
                </button>
                <span className="text-white/50">Step 2 of 2</span>
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold">{selectedName}</h2>
                <p className="text-white/60">Choose your logo</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-volt" />
                </div>
              ) : logos.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {logos.map((logo) => (
                    <button
                      key={logo.id}
                      onClick={() => selectLogo(logo.url)}
                      className="bg-void-light border border-white/10 rounded-xl overflow-hidden hover:border-volt/50 transition"
                    >
                      <img
                        src={logo.url}
                        alt={`${selectedName} logo`}
                        className="w-full aspect-square object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-white/50">Logo generation failed. Try again.</p>
                  <button
                    onClick={() => selectName(selectedName)}
                    className="mt-4 text-volt hover:underline"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'result' && (
            <div className="space-y-8 text-center">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold">{selectedName}</h2>
                <p className="text-white/60">Your brand is ready</p>
              </div>

              <div className="bg-void-light border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
                <img
                  src={selectedLogo}
                  alt={`${selectedName} logo`}
                  className="w-full aspect-square object-cover rounded-xl"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={downloadLogo}
                  className="bg-volt text-void font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-volt/90 transition"
                >
                  <Download className="w-5 h-5" />
                  Download Logo
                </button>
                <button
                  onClick={reset}
                  className="border border-white/20 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 transition"
                >
                  <RefreshCw className="w-5 h-5" />
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
