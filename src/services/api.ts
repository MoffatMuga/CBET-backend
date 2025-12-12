import axios from 'axios';

const API_URL = __DEV__ 
  ? 'http://localhost:3000/api/exam'  // For emulator
  : 'https://your-production-api.com/api/exam'; // For production

interface GeneratePaperRequest {
  paperText: string;
  subject: string;
  gradeLevel: string;
}

interface GeneratePaperResponse {
  success: boolean;
  paper: string;
  analysis: any;
}

export const examAPI = {
  generatePaper: async (data: GeneratePaperRequest): Promise<GeneratePaperResponse> => {
    try {
      const response = await axios.post(`${API_URL}/generate`, data, {
        timeout: 60000, // 60 seconds
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to generate paper');
    }
  },

  analyzePaper: async (data: GeneratePaperRequest) => {
    try {
      const response = await axios.post(`${API_URL}/analyze`, data, {
        timeout: 30000,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to analyze paper');
    }
  },
};