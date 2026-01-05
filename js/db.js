const DB_NAME = "clinelphDB";
const DB_VERSION = 2;
let db;

function openDatabase() {
  return new Promise(resolve => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = e => {
      db = e.target.result;
      ["patients","visits","auditLogs","comments"].forEach(s => {
        if (!db.objectStoreNames.contains(s)) {
          db.createObjectStore(s, { keyPath: "id" });
        }
      });
    };

    req.onsuccess = e => {
      db = e.target.result;
      resolve();
    };
  });
}

function addRecord(store, data) {
  data.id = crypto.randomUUID();
  db.transaction(store,"readwrite").objectStore(store).add(data);
}

function updateRecord(store, data) {
  db.transaction(store,"readwrite").objectStore(store).put(data);
}

function getAllRecords(store) {
  return new Promise(r => {
    const req = db.transaction(store).objectStore(store).getAll();
    req.onsuccess = () => r(req.result);
  });
}
