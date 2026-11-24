function normalizeMemberTypeIds(raw) {
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return [...new Set(list.map((id) => String(id || '').trim()).filter(Boolean))];
}

function noticeTargetsEveryone(notice) {
  return normalizeMemberTypeIds(notice?.memberTypeIds).length === 0;
}

function noticeVisibleToTypeIds(notice, typeIds) {
  if (noticeTargetsEveryone(notice)) return true;
  const targets = new Set(normalizeMemberTypeIds(notice?.memberTypeIds));
  return normalizeMemberTypeIds(typeIds).some((id) => targets.has(id));
}

function filterNoticesForTypeIds(notices, typeIds) {
  return (notices || []).filter((notice) => noticeVisibleToTypeIds(notice, typeIds));
}

module.exports = {
  normalizeMemberTypeIds,
  noticeTargetsEveryone,
  noticeVisibleToTypeIds,
  filterNoticesForTypeIds,
};
