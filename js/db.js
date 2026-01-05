request.onupgradeneeded = function (e) {
  db = e.target.result;

  if (!db.objectStoreNames.contains("patients"))
    db.createObjectStore("patients", { keyPath: "patientId" });

  if (!db.objectStoreNames.contains("visits"))
    db.createObjectStore("visits", { keyPath: "id", autoIncrement: true });

  if (!db.objectStoreNames.contains("adverseEvents"))
    db.createObjectStore("adverseEvents", { keyPath: "id", autoIncrement: true });

  if (!db.objectStoreNames.contains("withdrawals"))
    db.createObjectStore("withdrawals", { keyPath: "id", autoIncrement: true });

  if (!db.objectStoreNames.contains("events"))
    db.createObjectStore("events", { keyPath: "id", autoIncrement: true });
};
