const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Use the correct model name - gemini-1.5-flash (free tier)
const MODEL_NAME = 'gemini-2.5-flash';

exports.analyzePaper = async (paperText, subject, gradeLevel) => {
  try {
    console.log('🔍 Analyzing paper with Gemini 2.5 Flash...');
    
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Analyze this exam paper and extract its structure. Return ONLY valid JSON, no markdown or extra text.

Subject: ${subject}
Grade Level: ${gradeLevel}

Paper Content:
${paperText}

Return a JSON object with this exact structure:
{
  "topics": ["topic1", "topic2"],
  "questionTypes": [{"type": "MCQ", "count": 10}, {"type": "Short Answer", "count": 5}],
  "difficultyLevel": "medium",
  "totalMarks": 100,
  "timeAllocation": "3 hours",
  "keyThemes": ["theme1", "theme2"],
  "instructions": "any special instructions found"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📝 Raw AI response:', text);
    
    // Clean up response to extract JSON
    let jsonText = text.trim();
    // Remove markdown code blocks if present
    jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    const analysis = JSON.parse(jsonText);
    console.log('✅ Analysis complete:', analysis);
    
    return analysis;
  } catch (error) {
    console.error('❌ Error analyzing paper:', error);
    throw new Error('Failed to analyze paper: ' + error.message);
  }
};

exports.generateSimilarPaper = async (analysis, subject, gradeLevel) => {
  try {
    console.log('📝 Generating similar paper with Gemini 1.5 Flash...');
    
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `Generate a NEW exam paper based on this analysis:

Subject: ${subject}
Grade Level: ${gradeLevel}
Analysis: ${JSON.stringify(analysis, null, 2)}

Requirements:
- Use the SAME structure and format
- Cover the SAME topics but with DIFFERENT questions
- Maintain the SAME difficulty level
- Include the SAME types of questions
- Keep the SAME marking scheme

Generate a complete, formatted exam paper with:
1. Header (subject, time, total marks)
2. Instructions for students
3. All questions with proper numbering
4. Mark allocation for each question
5. Clear sections if multiple question types

Make it realistic and exam-ready. Format it professionally like a real exam paper.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedPaper = response.text();
    
    console.log('✅ Paper generated successfully');
    console.log('📄 Generated paper preview:', generatedPaper.substring(0, 200) + '...');
    
    return generatedPaper;
  } catch (error) {
    console.error('❌ Error generating paper:', error);
    throw new Error('Failed to generate paper: ' + error.message);
  }
};