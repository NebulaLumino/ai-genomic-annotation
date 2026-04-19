import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: 'https://api.deepseek.com/v1',
    });
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are an expert computational biologist and genomicist. Analyze the provided DNA or protein sequence and generate a comprehensive genomic annotation summary including:\n1. Gene structure prediction (exons, introns, UTRs, CDS)\n2. Functional domain identification\n3. Regulatory element annotation (promoters, enhancers, TF binding sites)\n4. Variant effect predictions (SNPs, indels)\n5. Homology and orthology analysis\n6. Functional pathway associations\n\nUse standard genomic notation and ensure scientific precision.`,
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
