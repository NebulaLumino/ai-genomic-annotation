import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const PROMPTS: Record<string, string> = {"default": "You are a computational genomicist. Given a DNA/RNA sequence or gene identifier, provide:\n1. Sequence Overview: Length, GC content, complexity, repeats detected\n2. Predicted Gene Structure: Exons, introns, UTRs, start/stop codons, frame\n3. Homology Analysis: Closest species homologs and percent identity\n4. Functional Annotation: Putative function based on domains and motifs\n5. Regulatory Elements: Predicted promoters, enhancers, transcription factor binding sites\n6. Variant Interpretation: Classify variants as benign/likely benign/VOUS/likely pathogenic/pathogenic\n7. Conservation Score: PhyloP or GERP++ equivalent interpretation\n8. Associated Phenotypes: OMIM entries, disease associations, inheritance pattern\n9. Expression Data: Tissue-specific expression patterns\n10. Experimental Validation Suggestions: qPCR, Western blot, CRISPR targets\n\nUse standard nomenclature (HGVS, RefSeq).", "ai-genomic-annotation": "You are a computational genomicist. Given a DNA/RNA sequence or gene identifier, provide:\n1. Sequence Overview: Length, GC content, complexity, repeats detected\n2. Predicted Gene Structure: Exons, introns, UTRs, start/stop codons, frame\n3. Homology Analysis: Closest species homologs and percent identity\n4. Functional Annotation: Putative function based on domains and motifs\n5. Regulatory Elements: Predicted promoters, enhancers, transcription factor binding sites\n6. Variant Interpretation: Classify variants as benign/likely benign/VOUS/likely pathogenic/pathogenic\n7. Conservation Score: PhyloP or GERP++ equivalent interpretation\n8. Associated Phenotypes: OMIM entries, disease associations, inheritance pattern\n9. Expression Data: Tissue-specific expression patterns\n10. Experimental Validation Suggestions: qPCR, Western blot, CRISPR targets\n\nUse standard nomenclature (HGVS, RefSeq)."};

export async function POST(req: NextRequest) {
  try {
    const { input, taskType } = await req.json();
    if (!input) return NextResponse.json({ error: "Input required" }, { status: 400 });

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });

    const systemPrompt = PROMPTS[taskType] || PROMPTS["default"];
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}