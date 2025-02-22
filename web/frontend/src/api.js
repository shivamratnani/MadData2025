const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export async function submitDream(dreamText) {
    try {
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