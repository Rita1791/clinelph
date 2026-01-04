<script>
const DB_NAME = "clinelphDB";
const DB_VERSION = 1;
let db;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function (event) {
      db = event.target.result;

      if (!db.objectStoreNames.contains("users"))
        db.createObjectStore("users", { keyPath: "userId" });

      if (!db.objectStoreNames.contains("studies"))
        db.createObjectStore("studies", { keyPath: "studyId" });

      if (!db.objectStoreNames.contains("patients"))
        db.createObjectStore("patients", { keyPath: "patientId" });

      if (!db.objectStoreNames.contains("visits"))
        db.createObjectStore("visits", { keyPath: "visitId" });

      if (!db.objectStoreNames.contains("events"))
        db.createObjectStore("events", { keyPath: "eventId" });

      if (!db.objectStoreNames.contains("withdrawals"))
        db.createObjectStore("withdrawals", { keyPath: "withdrawalId" });

      if (!db.objectStoreNames.contains("auditLogs"))
        db.createObjectStore("auditLogs", { keyPath: "logId" });
    };

    request.onsuccess = function (event) {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = function () {
      reject("Failed to open database");
    };
  });
}
</script>
