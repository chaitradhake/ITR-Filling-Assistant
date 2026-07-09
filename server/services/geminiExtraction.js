import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

export async function extractForm16Data(filePath, mimeType) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables');
  }

  // Read file and convert to base64
  let fileBuffer;
  try {
    fileBuffer = fs.readFileSync(filePath);
  } catch (error) {
    throw new Error(`Failed to read file from path ${filePath}: ${error.message}`);
  }
  const base64Data = fileBuffer.toString('base64');

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `Extract these fields from the Form 16 document and return ONLY valid JSON, no markdown formatting, no explanation text:
{
  "grossSalary": number,
  "tdsDeducted": number,
  "section80C": number,
  "section80D": number,
  "hraExemption": number,
  "otherDeductions": number
}
For "otherDeductions", only include deductions from Chapter VI-A (sections 80E, 80G, 80TTA, 80CCD etc.) — do NOT include standard deduction or professional tax/tax on employment, since those are handled separately by the application.
If a field cannot be found in the document, use 0 as the value.`;

  let responseText;
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    });
    responseText = result.response.text();
  } catch (error) {
    throw new Error(`Gemini API call failed: ${error.message}`);
  }

  let parsedData;
  try {
    let jsonText = responseText.trim();
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }
    parsedData = JSON.parse(jsonText);
  } catch (error) {
    throw new Error('Failed to parse extracted data from document');
  }

  // Ensure fields are numbers, default to 0 if not present or not a number
  const fields = ['grossSalary', 'tdsDeducted', 'section80C', 'section80D', 'hraExemption', 'otherDeductions'];
  const resultData = {};
  for (const field of fields) {
    const val = parsedData[field];
    resultData[field] = typeof val === 'number' && !isNaN(val) ? val : 0;
  }

  return resultData;
}
