// Client-side file storage utility supporting in-memory cache with IndexedDB persistence
// Allows full-resolution artwork files (images, PDFs, SVGs) to survive page navigation
// and be uploaded during checkout to the server API and Telegram.

const DB_NAME = 'rs_printer_files_db';
const STORE_NAME = 'artwork_files';
const DB_VERSION = 1;

// Fast in-memory map for the current active browser tab
const memoryFileStore = new Map<string, File>();

function getIndexedDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Persists an uploaded artwork File to memory and IndexedDB.
 */
export async function saveArtworkFile(fileId: string, file: File): Promise<void> {
  memoryFileStore.set(fileId, file);

  try {
    const db = await getIndexedDB();
    if (!db) return;

    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.put(file, fileId);

      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.warn('Artwork file indexedDB save failed, falling back to memory store', e);
  }
}

/**
 * Retrieves an uploaded artwork File by its fileId.
 */
export async function getArtworkFile(fileId: string): Promise<File | null> {
  // Check memory store first
  if (memoryFileStore.has(fileId)) {
    return memoryFileStore.get(fileId) || null;
  }

  try {
    const db = await getIndexedDB();
    if (!db) return null;

    return await new Promise<File | null>((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.get(fileId);

      req.onsuccess = () => {
        const result = req.result as File | undefined;
        if (result) {
          memoryFileStore.set(fileId, result);
          resolve(result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Removes an artwork file by its fileId.
 */
export async function removeArtworkFile(fileId: string): Promise<void> {
  memoryFileStore.delete(fileId);

  try {
    const db = await getIndexedDB();
    if (!db) return;

    await new Promise<void>((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.delete(fileId);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {}
}

/**
 * Clears all saved artwork files after order completion.
 */
export async function clearArtworkFiles(): Promise<void> {
  memoryFileStore.clear();

  try {
    const db = await getIndexedDB();
    if (!db) return;

    await new Promise<void>((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {}
}
