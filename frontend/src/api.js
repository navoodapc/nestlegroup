// Central API base URL
// In production (GitHub Pages), this points to the deployed Render backend.
// In development (local), it falls back to localhost:5000.
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export default API_BASE;
