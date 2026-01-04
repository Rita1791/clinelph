function canEdit() {
  return ["DataEntry","CRC","Phlebotomist","OA"].includes(getCurrentUser().role);
}

function canDelete() {
  return ["QC","QA","PI"].includes(getCurrentUser().role);
}

function canViewOnly() {
  return ["QC","QA","Sponsor"].includes(getCurrentUser().role);
}
