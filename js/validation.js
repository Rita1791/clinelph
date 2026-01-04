function logAudit(entity, entityId, field, oldValue, newValue) {
  const user = getCurrentUser();

  const log = {
    logId: `AUD-${Date.now()}`,
    entity: entity,
    entityId: entityId,
    fieldChanged: field,
    oldValue: oldValue,
    newValue: newValue,
    changedBy: user.email,
    changedAt: new Date().toISOString()
  };

  addRecord("auditLogs", log);
}
async function failVisit(visit, reason) {
  visit.visitStatus = "Failed";
  await updateRecord("visits", visit);

  await addRecord("events", {
    eventId: `EVT-${Date.now()}`,
    patientId: visit.patientId,
    visitNumber: visit.visitNumber,
    reason: reason,
    date: new Date().toISOString()
  });

  await updatePatientStatus(visit.patientId, "Failed");

  throw new Error("Visit Failed: " + reason);
}
