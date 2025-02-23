import { supabase } from "./supabase";
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export async function submitDream(dreamText) {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        const response = await fetch(`${API_BASE}/dreams/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dream_text: dreamText }),
        });
        
        if (!response.ok) {
            throw new Error('Failed to submit dream');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error submitting dream:', error);
        throw error;
    }
}

export const fetchDreams = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
  
      if (userError) {
        throw new Error(userError.message);
      }
  
      if (!user || !user.id) {
        throw new Error('User is not authenticated or user ID is missing');
      }
  
      console.log('Authenticated user ID:', user.id); 
  

      const { data, error } = await supabase
        .from('Dreams')
        .select('*')
  
      if (error) {
        throw error;
      }
      console.log(data)
      return data || [];
  
    } catch (error) {
      console.error('Error fetching dreams:', error.message);
      return [];
    }
  };