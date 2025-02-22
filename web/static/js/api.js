import { supabase } from './supabase';

const API_BASE = process.env.NODE_ENV === 'production' 
    ? '/api'  // Production path
    : 'http://localhost:8000/api';  // Development path

async function getAuthHeaders() {
    const session = await supabase.auth.getSession();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`,
    };
}

export async function submitDream(dreamText) {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/dreams/`, {
            method: 'POST',
            headers,
            credentials: 'include',
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

export async function getDreamHistory() {
    try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE}/dreams/history/`, {
            headers,
            credentials: 'include',
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch dream history');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching dream history:', error);
        throw error;
    }
} 