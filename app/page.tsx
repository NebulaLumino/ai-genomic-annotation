"use client";
import { useState } from "react";

const APP_NAME = "AI Genomic Sequence Annotation Helper";
const DESC = "Helps annotate genomic sequences, identify gene functions, and variant implications.";
const ACCENT_CLASS = "from-sky-600 via-sky-700 to-sky-800";

const PROMPTS: Record<string, string> = {
      "default": "You are a computational genomicist. Given a DNA/RNA sequence or gene identifier, provide:\n1. Sequence Overview: Length, GC content, complexity, repeats detected\n2. Predicted Gene Structure: Exons, introns, UTRs, start/stop codons, frame\n3. Homology Analysis: Closest species homologs and percent identity\n4. Functional Annotation: Putative function based on domains and motifs\n5. Regulatory Elements: Predicted promoters, enhancers, transcription factor binding sites\n6. Variant Interpretation: Classify variants as benign/likely benign/VOUS/likely pathogenic/pathogenic\n7. Conservation Score: PhyloP or GERP++ equivalent interpretation\n8. Associated Phenotypes: OMIM entries, disease associations, inheritance pattern\n9. Expression Data: Tissue-specific expression patterns\n10. Experimental Validation Suggestions: qPCR, Western blot, CRISPR targets\n\nUse standard nomenclature (HGVS, RefSeq).",
      "ai-genomic-annotation": "You are a computational genomicist. Given a DNA/RNA sequence or gene identifier, provide:\n1. Sequence Overview: Length, GC content, complexity, repeats detected\n2. Predicted Gene Structure: Exons, introns, UTRs, start/stop codons, frame\n3. Homology Analysis: Closest species homologs and percent identity\n4. Functional Annotation: Putative function based on domains and motifs\n5. Regulatory Elements: Predicted promoters, enhancers, transcription factor binding sites\n6. Variant Interpretation: Classify variants as benign/likely benign/VOUS/likely pathogenic/pathogenic\n7. Conservation Score: PhyloP or GERP++ equivalent interpretation\n8. Associated Phenotypes: OMIM entries, disease associations, inheritance pattern\n9. Expression Data: Tissue-specific expression patterns\n10. Experimental Validation Suggestions: qPCR, Western blot, CRISPR targets\n\nUse standard nomenclature (HGVS, RefSeq)."
};

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, taskType: "ai-genomic-annotation" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setOutput(data.result);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-3xl mb-8 text-center">
        <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${ACCENT_CLASS} bg-clip-text text-transparent`}>
          {APP_NAME}
        </h1>
        <p className="text-gray-400 text-lg">{DESC}</p>
      </div>

      <div className="w-full max-w-3xl bg-gray-800/60 border border-gray-700 rounded-2xl p-6 mb-6 backdrop-blur-sm">
        <textarea
          className="w-full bg-gray-900/80 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-sky-500"
          rows={6}
          placeholder="Describe your research topic, parameters, or data..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !input.trim()}
          className={`mt-4 w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
            loading || !input.trim()
              ? "bg-gray-700 text-gray-500 cursor-not-allowed"
              : `bg-gradient-to-r ${ACCENT_CLASS} text-white hover:opacity-90 hover:scale-[1.01]`
          }`}>
          {loading ? "Generating... Please wait" : "Generate Report"}
        </button>
        {error && (
          <p className="mt-3 text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">{error}</p>
        )}
      </div>

      {output && (
        <div className="w-full max-w-3xl bg-gray-800/60 border border-gray-700 rounded-2xl p-6 backdrop-blur-sm">
          <h2 className="text-lg font-semibold mb-3 text-gray-200">Generated Output</h2>
          <div className="bg-gray-900/80 border border-gray-700 rounded-xl p-4 text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
            {output}
          </div>
        </div>
      )}
    </main>
  );
}