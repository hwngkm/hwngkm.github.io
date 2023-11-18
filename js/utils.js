// Register Service Worker
export async function registerSW() {
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("sw.js");
        } catch (e) {
            console.log("SW install fail");
        }
    }
}

// Save value to localStorage and call exportData
export function saveValue(id, value) {
    localStorage.setItem(id, value);
    exportData(value);
}

// Get saved value from localStorage
export function getSavedValue(key) {
    return localStorage.getItem(key) || "";
}