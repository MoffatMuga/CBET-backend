const aiService = require('../services/aiService');

exports.generatePaper = async (req, res) => {
  try {
    const { paperText, subject, gradeLevel } = req.body;

    if (!paperText || !subject || !gradeLevel) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['paperText', 'subject', 'gradeLevel']
      });
    }

    console.log(`📚 Generating paper for ${subject} - ${gradeLevel}`);

    // Step 1: Analyze
    const analysis = await aiService.analyzePaper(paperText, subject, gradeLevel);
    console.log('✅ Analysis complete');

    // Step 2: Generate
    const generatedPaper = await aiService.generateSimilarPaper(analysis, subject, gradeLevel);
    console.log('✅ Paper generated');

    res.json({ 
      success: true, 
      paper: generatedPaper,
      analysis: analysis
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate paper',
      details: error.message 
    });
  }
};

exports.analyzePaper = async (req, res) => {
  try {
    const { paperText } = req.body;
    
    const analysis = await aiService.analyzePaper(paperText);
    
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ 
      error: 'Analysis failed',
      details: error.message 
    });
  }
};