import { useRef, useState } from 'react'
import axios from 'axios'
import Webcam from 'react-webcam'
import './App.css'

const paletteMap = {
  Warm: {
    label: 'Earth tones',
    colors: ['#A25B26', '#D98F55', '#C2A97F', '#8F5E3F'],
  },
  Cool: {
    label: 'Jewel tones',
    colors: ['#1D4E89', '#5E7CFA', '#7B5FA1', '#00A8C6'],
  },
  Neutral: {
    label: 'Soft neutrals',
    colors: ['#C1B497', '#B4A090', '#8C7F71', '#D8CAB8'],
  },
}

function App() {
  const [activeTab, setActiveTab] = useState('upload')
  const [previewUrl, setPreviewUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const webcamRef = useRef(null)

  const apiUrl = `${import.meta.env.VITE_API_URL || ''}/analyze`

  const getUndertoneFromHex = (hex) => {
    const sanitized = hex?.replace('#', '').trim()
    if (!/^[0-9a-fA-F]{6}$/.test(sanitized)) return 'Neutral'

    const r = parseInt(sanitized.slice(0, 2), 16)
    const g = parseInt(sanitized.slice(2, 4), 16)
    const b = parseInt(sanitized.slice(4, 6), 16)
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min

    if (diff < 20) return 'Neutral'
    if (r > b && r > g) return 'Warm'
    if (b > r && b > g) return 'Cool'
    if (g > r && g > b) return 'Warm'
    return 'Neutral'
  }

  const dataUrlToFile = async (dataUrl, filename = 'capture.png') => {
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    return new File([blob], filename, { type: blob.type })
  }

  const submitImage = async (file) => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const skinTone = response?.data?.skinTone || response?.data?.tone || response?.data?.hex
      if (!skinTone) {
        throw new Error('No skin tone was returned from the backend.')
      }

      const undertone = getUndertoneFromHex(skinTone)
      setResult({
        skinTone,
        undertone,
        palette: paletteMap[undertone] || paletteMap.Neutral,
      })
    } catch (err) {
      setError(
        err?.response?.data?.message || err.message || 'Unable to analyze the image. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleUploadChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.')
      return
    }

    setPreviewUrl(URL.createObjectURL(file))
    await submitImage(file)
  }

  const capturePhoto = async () => {
    const screenshot = webcamRef.current?.getScreenshot()
    if (!screenshot) {
      setError('Unable to capture a camera image.')
      return
    }

    setPreviewUrl(screenshot)
    const file = await dataUrlToFile(screenshot, 'camera-capture.jpeg')
    await submitImage(file)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl shadow-slate-950/40">
        <header className="mb-8 flex flex-col gap-3 text-center sm:text-left sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Human Skin Tone Analyzer</p>
            <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Find your undertone + clothing palette</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-400">
            Upload a natural light photo or use your live camera to analyze skin tone and get tailored clothing recommendations.
          </p>
        </header>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          {['upload', 'camera'].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab)
                setError('')
                setResult(null)
                setPreviewUrl('')
              }}
              className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
                activeTab === tab
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'border border-slate-700 bg-slate-950/80 text-slate-300 hover:border-slate-500 hover:text-white'
              }`}
            >
              {tab === 'upload' ? 'Upload Natural Light Photo' : 'Use Live Camera'}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            {activeTab === 'upload' ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">Select a natural light image of your skin for the most accurate analysis.</p>
                <label className="block w-full rounded-3xl border border-slate-700 bg-slate-900/90 p-4 text-center text-sm text-slate-300 transition hover:border-slate-500">
                  <span className="block text-base font-medium text-white">Choose an image</span>
                  <input type="file" accept="image/*" onChange={handleUploadChange} className="mt-4 hidden" />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">Allow camera access and capture a frame with visible skin under natural lighting.</p>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-3">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: 'user' }}
                    className="h-[320px] w-full overflow-hidden rounded-3xl object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Capture frame
                </button>
              </div>
            )}

            {loading && (
              <div className="flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
                <div>
                  <p className="text-sm font-semibold text-white">Analyzing photo...</p>
                  <p className="text-sm text-slate-400">This may take a few seconds.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                {error}
              </div>
            )}

            {previewUrl && (
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-300">Preview</p>
                <img src={previewUrl} alt="Preview" className="w-full rounded-3xl object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-5 rounded-3xl border border-slate-800 bg-slate-950/80 p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">Results</p>
              <h2 className="mt-3 text-2xl font-semibold text-white">Your skin tone assessment</h2>
            </div>

            {result ? (
              <div className="space-y-5">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="h-16 w-16 rounded-3xl border border-slate-700" style={{ backgroundColor: result.skinTone }} />
                    <div>
                      <p className="text-sm text-slate-400">Detected skin tone</p>
                      <p className="mt-1 text-lg font-semibold text-white">{result.skinTone}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
                  <p className="text-sm text-slate-400">Undertone</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{result.undertone}</p>
                </div>

                <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Recommended Clothing Palette</p>
                      <p className="mt-1 text-base font-semibold text-white">{result.palette.label}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {result.palette.colors.map((color) => (
                      <div key={color} className="rounded-3xl border border-slate-700 p-4 text-center">
                        <div className="mx-auto mb-3 h-16 w-16 rounded-2xl shadow-inner" style={{ backgroundColor: color }} />
                        <p className="text-xs font-semibold text-slate-200">{color}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/90 p-6 text-sm text-slate-400">
                Upload or capture a photo to view your skin tone result and palette recommendations.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
