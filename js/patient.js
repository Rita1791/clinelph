function generatePatientId(siteCode) {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `CLP-${siteCode}-${year}-${seq}`;
}
async function updatePatientStatus(patientId, status) {
  const patients = await getAllRecords("patients");
  const patient = patients.find(p => p.patientId === patientId);

  patient.status = status;
  await updateRecord("patients", patient);
}
async function promotePatientToNextVisit(patientId, nextVisit) {
  const patients = await getAllRecords("patients");
  const patient = patients.find(p => p.patientId === patientId);

  patient.currentVisit = nextVisit;
  patient.status = "Ongoing";
  await updateRecord("patients", patient);

  initializeVisit(patientId, nextVisit);
}
