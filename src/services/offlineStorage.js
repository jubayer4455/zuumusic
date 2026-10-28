// IndexedDB Persistent Offline Media Storage Engine
// Stores real audio binary blobs (MP3 / AAC / M4A) directly inside device storage
// Enables 100% offline playback with zero internet, zero buffering, and lockscreen controls

const DB_NAME = 'zuu_music_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'downloaded_tracks';

// Open or initialize IndexedDB
export const openOfflineDB = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error("IndexedDB not supported in this browser environment"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Save track metadata and binary audio blob to device storage
 */
export const saveOfflineTrack = async (track, audioBlob) => {
  const db = await openOfflineDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record = {
      id: track.id,
      title: track.title,
      artist: track.artist || "Offline Artist",
      album: track.album || "Offline Library",
      cover: track.cover || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80",
      duration: track.duration || "3:30",
      durationSec: track.durationSec || 210,
      audioBlob: audioBlob,
      mimeType: audioBlob.type || 'audio/mpeg',
      savedAt: Date.now(),
      dateAdded: "Downloaded",
      isOffline: true,
      genre: track.genre || "offline"
    };

    const request = store.put(record);

    request.onsuccess = () => {
      resolve(record);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
};

/**
 * Get all saved offline tracks for display in the library
 */
export const getAllOfflineTracks = async () => {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const records = request.result || [];
        // Map to playable track objects with active Blob URLs
        const playableTracks = records.map(record => {
          let blobUrl = '';
          if (record.audioBlob) {
            try {
              blobUrl = URL.createObjectURL(record.audioBlob);
            } catch (e) {
              console.warn("Could not create object URL for blob:", e);
            }
          }
          return {
            id: record.id,
            title: record.title,
            artist: record.artist,
            album: record.album,
            cover: record.cover,
            duration: record.duration,
            durationSec: record.durationSec,
            audioUrl: blobUrl || record.audioUrl,
            fallbackUrl: blobUrl || record.fallbackUrl,
            dateAdded: record.dateAdded || "Downloaded",
            isOffline: true,
            isDownloaded: true,
            genre: record.genre || "offline"
          };
        });
        resolve(playableTracks);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn("Error getting offline tracks from IndexedDB:", err);
    return [];
  }
};

/**
 * Get a specific offline track with active playable Blob URL
 */
export const getOfflineTrack = async (trackId) => {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(trackId);

      request.onsuccess = () => {
        const record = request.result;
        if (!record || !record.audioBlob) {
          resolve(null);
          return;
        }

        const blobUrl = URL.createObjectURL(record.audioBlob);
        resolve({
          ...record,
          audioUrl: blobUrl,
          fallbackUrl: blobUrl,
          isOffline: true,
          isDownloaded: true
        });
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (err) {
    console.warn("Error fetching single offline track:", err);
    return null;
  }
};

/**
 * Delete a track from offline IndexedDB storage
 */
export const removeOfflineTrack = async (trackId) => {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(trackId);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("Error deleting offline track:", err);
    return false;
  }
};

/**
 * Clear all offline tracks from device storage
 */
export const clearAllOfflineTracks = async () => {
  try {
    const db = await openOfflineDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn("Error clearing offline storage:", err);
    return false;
  }
};
