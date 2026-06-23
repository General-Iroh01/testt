import json
import time
from typing import Any, Optional
import hashlib
from datetime import datetime

class Cache:
    """Basit in-memory cache sistemi"""
    
    def __init__(self):
        self._cache: dict = {}
        self._timestamps: dict = {}
    
    def get(self, key: str) -> Optional[Any]:
        """Cache'den veri al"""
        if key not in self._cache:
            return None
        
        # TTL kontrol
        if key in self._timestamps:
            if time.time() - self._timestamps[key] > 3600:  # 1 saat
                del self._cache[key]
                del self._timestamps[key]
                return None
        
        return self._cache[key]
    
    def set(self, key: str, value: Any, ttl: int = 3600):
        """Cache'e veri yaz"""
        self._cache[key] = value
        self._timestamps[key] = time.time()
    
    def delete(self, key: str):
        """Cache'ten sil"""
        if key in self._cache:
            del self._cache[key]
        if key in self._timestamps:
            del self._timestamps[key]
    
    def clear(self):
        """TÃ¼mÃ¼nÃ¼ temizle"""
        self._cache.clear()
        self._timestamps.clear()
    
    def make_key(self, *args) -> str:
        """Cache key oluÅŸtur"""
        raw = "_".join(str(a) for a in args)
        return hashlib.md5(raw.encode()).hexdigest()

# Global cache instance
cache = Cache()
