// js/db.js

const DB_NAME = "clinelphDB";
const DB_VERSION = 1;
let db;

function openDatabase() {
  return new Promise((resolve) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = e => {
      db = e.target.result;
      ["patients","visits","audit"].forEach(s => {
        if (!db.objectStoreNames.contains(s))
          db.createObjectStore(s, { keyPath: "id" });
      });
    };

    req.onsuccess = e => {
      db = e.target.result;
      resolve();
    };
  });
}

function add(store, obj) {
  return new Promise(r => {
    const tx = db.transaction(store,"readwrite");
    tx.objectStore(store).put(obj);
    tx.oncomplete = r;
  });
}

function getAll(store) {
  return new Promise(r => {
    const tx = db.transaction(store);
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => r(req.result);
  });
}
