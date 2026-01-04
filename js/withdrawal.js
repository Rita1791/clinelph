async function withdrawPatient(patientId, reason) {
  await addRecord("withdrawals", {
    withdrawalId: `WD-${Date.now()}`,
    patientId: patientId,
    reason: reason,
    date: new Date().toISOString()
  });

  await updatePatientStatus(patientId, "Withdrawn");
}
