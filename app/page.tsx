'use client';

import { useState } from 'react';

const ACCENT = 'text-cyan-400';
const ACCENT_BG = 'bg-cyan-500/20';
const ACCENT_BORDER = 'border-cyan-500/40';
const ACCENT_GLOW = 'shadow-cyan-500/20';

export default function GenomicAnnotationPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError('');
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className={`${ACCENT} text-sm font-semibold tracking-widest uppercase mb-3`}>🧬 AI Science App</div>
          <h1 className="text-4xl font-bold text-white mb-4">Genomic Sequence Annotation Summary Generator</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Submit DNA or protein sequences and receive AI-generated annotations including gene structures, functional domains, regulatory elements, and variant effect predictions.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Genomic Sequence Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={"Paste DNA/protein sequence (FASTA format, gene names, chromosome coordinates)..."}
              className={`w-full h-48 bg-gray-800/60 ${ACCENT_BORDER} border rounded-xl p-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-y font-mono text-sm`}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className={`px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
              loading || !input.trim()
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : `bg-cyan-600 hover:bg-cyan-500 ${ACCENT_GLOW} shadow-lg`
            }`}
          >
            {loading ? 'Annotating Sequence...' : 'Generate Annotation'}
          </button>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-500/40 rounded-xl text-red-400 text-sm">{error}</div>
          )}

          {result && (
            <div className={`p-6 bg-gray-800/60 ${ACCENT_BORDER} border rounded-xl ${ACCENT_GLOW} shadow-xl`}>
              <div className={`${ACCENT} text-sm font-semibold tracking-wide uppercase mb-4`}>🧬 Genomic Annotation Report</div>
              <div className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap">{result}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
