function splitName(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function displayName(firstName, lastName, fallback = '') {
  const full = [firstName, lastName].map((part) => String(part || '').trim()).filter(Boolean).join(' ');
  return full || String(fallback || '').trim();
}

function resolveMemberNames(input = {}) {
  let firstName = String(input.firstName || '').trim();
  let lastName = String(input.lastName || '').trim();
  const name = String(input.name || '').trim();
  if (!firstName && !lastName && name) {
    const split = splitName(name);
    firstName = split.firstName;
    lastName = split.lastName;
  }
  return {
    firstName: firstName || null,
    lastName: lastName || null,
    name: displayName(firstName, lastName, name),
  };
}

module.exports = { splitName, displayName, resolveMemberNames };
