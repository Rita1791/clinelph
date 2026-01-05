let db;

function openDB() {
  return new Promise(resolve => {
    const req = indexedDB.open("clinelphDB", 1);

    req.onupgradeneeded = e => {
      db = e.target.result;
      db.createObjectStore("patients", { keyPath: "patientId" });
      db.createObjectStore("visits", { keyPath: "id", autoIncrement: true });
    };

    req.onsuccess = e => {
      db = e.target.result;
      resolve();
    };
  });
}

function add(store, data) {
  db.transaction(store, "readwrite").objectStore(store).add(data);
}

function getAll(store) {
  return new Promise(resolve => {
    const req = db.transaction(store).objectStore(store).getAll();
    req.onsuccess = () => resolve(req.result);
  });
}

function update(store, data) {
  db.transaction(store, "readwrite").objectStore(store).put(data);
}
