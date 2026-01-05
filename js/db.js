let db;

function openDB() {
  return new Promise((resolve) => {
    const req = indexedDB.open("clinelphDB", 1);
    req.onupgradeneeded = e => {
      db = e.target.result;
      db.createObjectStore("patients", { keyPath: "patientId" });
      db.createObjectStore("visits", { keyPath: "id", autoIncrement: true });
      db.createObjectStore("adverseEvents", { keyPath: "id", autoIncrement: true });
      db.createObjectStore("withdrawals", { keyPath: "id", autoIncrement: true });
      db.createObjectStore("auditLogs", { keyPath: "id", autoIncrement: true });
    };
    req.onsuccess = e => {
      db = e.target.result;
      resolve();
    };
  });
}

function addRecord(store, data) {
  return new Promise(res => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).add(data);
    tx.oncomplete = () => res();
  });
}

function getAllRecords(store) {
  return new Promise(res => {
    const tx = db.transaction(store, "readonly");
    const req = tx.objectStore(store).getAll();
    req.onsuccess = () => res(req.result);
  });
}

function updateRecord(store, data) {
  return new Promise(res => {
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(data);
    tx.oncomplete = () => res();
  });
}
