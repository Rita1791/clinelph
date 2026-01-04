const DB_NAME = "clinelphDB";
const DB_VERSION = 1;
let db;

function openDatabase() {
  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = e => {
      db = e.target.result;
      ["patients","visits","auditLogs"].forEach(store => {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { keyPath: "id" });
        }
      });
    };

    request.onsuccess = e => {
      db = e.target.result;
      resolve();
    };
  });
}

function addRecord(store, data) {
  data.id = crypto.randomUUID();
  const tx = db.transaction(store, "readwrite");
  tx.objectStore(store).add(data);
}

function updateRecord(store, data) {
  const tx = db.transaction(store, "readwrite");
  tx.objectStore(store).put(data);
}

function getAllRecords(store) {
  return new Promise(resolve => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
  });
}
