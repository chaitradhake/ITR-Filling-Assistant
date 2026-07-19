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

  const prompt = `First, verify whether the uploaded document is actually an Indian Form 16 (Part A and/or Part B).
Then, extract the fields from the Form 16 document and return ONLY valid JSON in this exact shape, with no markdown formatting, no markdown code blocks, and no explanation text:
{
  "isForm16": true or false,
  "grossSalary": number,
  "tdsDeducted": number,
  "section80C": number,
  "section80D": number,
  "hraExemption": number,
  "otherDeductions": number
}

Instructions:
1. If the document does NOT appear to be a Form 16 (e.g. it's a random PDF, a different type of document, an image unrelated to salary/tax, or unreadable), set "isForm16": false and set all numeric fields to 0.
2. Only extract real values and set "isForm16": true if the document genuinely contains Form 16 structure/content (e.g. mentions of "Form 16", "TDS", "Part A", "Part B", employer/employee salary details, section 192, etc.).
3. For "otherDeductions", only include deductions from Chapter VI-A (sections 80E, 80G, 80TTA, 80CCD etc.) — do NOT include standard deduction or professional tax/tax on employment, since those are handled separately by the application.
4. If a field cannot be found in the document, use 0 as the value.`;

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

  // Ensure fields are validated, default to 0 for numbers if not present or not a number
  const fields = ['grossSalary', 'tdsDeducted', 'section80C', 'section80D', 'hraExemption', 'otherDeductions'];
  const resultData = {
    isForm16: parsedData.isForm16 === true
  };
  for (const field of fields) {
    const val = parsedData[field];
    resultData[field] = typeof val === 'number' && !isNaN(val) ? val : 0;
  }

  return resultData;
}
