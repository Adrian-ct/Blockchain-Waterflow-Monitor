// getPrivateKey.ts
import axios from 'axios';

export async function getPrivateKey(email: string): Promise<string | null> {
  try {
    const response = await axios.get('/api/getPrivateKey', { params: { email } });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
