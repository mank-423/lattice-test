class APICache {
  constructor(ttl = 5 * 60 * 1000) { // Default 5 minutes TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  getKey(endpoint, params) {
    return `${endpoint}|${JSON.stringify(params)}`;
  }

  set(endpoint, params, data) {
    const key = this.getKey(endpoint, params);
    const timestamp = Date.now();
    this.cache.set(key, { data, timestamp });
    
    // Clean up old entries periodically
    if (this.cache.size > 100) {
      this.cleanup();
    }
  }

  get(endpoint, params) {
    const key = this.getKey(endpoint, params);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    const isExpired = Date.now() - entry.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

export const apiCache = new APICache();