// js/db.js

let db = null;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("clinelphDB", 1);

    request.onupgradeneeded = function (e) {
      db = e.target.result;

      if (!db.objectStoreNames.contains("patients")) {
        db.createObjectStore("patients", { keyPath: "patientId" });
      }

      if (!db.objectStoreNames.contains("visits")) {
        db.createObjectStore("visits", { keyPath: "id", autoIncrement: true });
      }

      if (!db.objectStoreNames.contains("auditLogs")) {
        db.createObjectStore("auditLogs", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = function (e) {
      db = e.target.result;
      resolve(db);
    };

    request.onerror = function () {
      reject("Failed to open IndexedDB");
    };
  });
}

/* ---------- GENERIC HELPERS ---------- */

function addRecord(storeName, data) {
  return new Promise(resolve => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).add(data);
    tx.oncomplete = () => resolve();
  });
}

function getAllRecords(storeName) {
  return new Promise(resolve => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result);
  });
}

function updateRecord(storeName, data) {
  return new Promise(resolve => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(data);
    tx.oncomplete = () => resolve();
  });
}
