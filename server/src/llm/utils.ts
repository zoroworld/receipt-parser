export function extractJSON(text: string) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in LLM response");
  
    return JSON.parse(match[0]);
  }