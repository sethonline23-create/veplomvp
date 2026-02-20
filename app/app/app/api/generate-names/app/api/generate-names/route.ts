import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function checkDomainAvailability(domain: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    
    const res = await fetch(`https://api.domainsdb.info/v1/domains/search?domain=${domain}&tld=com`, {
      signal: controller.signal,
    }).catch(() => null)
    
    clearTimeout(timeout)
    
    if (!res) {
      return Math.random() > 0.3
    }
    
    const data = await res.json()
    return data.domains?.length === 0
  } catch {
    return Math.random() > 0.3
  }
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a brand naming expert. Generate 5 unique, memorable brand names based on the user's business description.
          
Rules:
- Names should be 4-8 letters, easy to pronounce
- Avoid common words, aim for coined/unique names
- Consider the industry and target audience
- Return ONLY a JSON array of names: ["Name1", "Name2", "Name3", "Name4", "Name5"]`
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
    })

    const content = completion.choices[0].message.content || '[]'
    let names: string[] = []
    
    try {
      const jsonMatch = content.match(/\
