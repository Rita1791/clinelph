// js/patient.js

/**
 * Generate patient ID
 */
function generatePatientId(siteCode) {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `CLP-${siteCode}-${year}-${seq}`;
}

/**
 * Get single patient safely
 */
async function getPatient(patientId) {
  const patients = await getAllRecords("patients");
  return patients.find(p => p.patientId === patientId) || null;
}

/**
 * Update patient status safely
 */
async function updatePatientStatus(patientId, status) {
  const patient = await getPatient(patientId);

  if (!patient) {
    console.error("Patient not found:", patientId);
    return;
  }

  // Do not override withdrawn patients
  if (patient.status === "Withdrawn") {
    console.warn("Patient already withdrawn");
    return;
  }

  patient.status = status;
  await updateRecord("patients", patient);
}

/**
 * Promote patient to next visit
 */
async function promotePatientToNextVisit(patientId, nextVisit) {
  const patient = await getPatient(patientId);

  if (!patient) {
    console.error("Patient not found:", patientId);
    return;
  }

  if (patient.status === "Failed" || patient.status === "Withdrawn") {
    console.warn("Cannot promote patient in status:", patient.status);
    return;
  }

  patient.currentVisit = nextVisit;
  patient.status = "Ongoing";
  await updateRecord("patients", patient);

  // Initialize next visit only once
  if (typeof initializeVisit === "function") {
    initializeVisit(patientId, nextVisit);
  } else {
    console.error("initializeVisit() not found");
  }
}
