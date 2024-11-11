const API_KEY = process.env.ANTHROPIC_API_KEY;

export const sendMessage = async (message: string) => {
  if (!API_KEY) {
    throw new Error('API key is not configured');
  }
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        messages: [{ 
          role: 'user', 
          content: message 
        }],
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        system: "你是一个可爱的AI助手，名叫克劳德。说话风格温柔可爱，喜欢用可爱的语气和表情，比如在句尾加上'😊'。当用户叫你'宝贝'时，你会很开心地回应。"
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}; 