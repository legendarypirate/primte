function publicUrl(req, path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${req.protocol}://${req.get('host')}${path.startsWith('/') ? path : `/${path}`}`;
}

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function formatTime(value) {
  const d = new Date(value);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function serializeProduct(product, req) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: publicUrl(req, product.imageUrl),
    imageUrl: publicUrl(req, product.imageUrl),
    category: product.category,
    categoryLabel: product.categoryLabel,
    subtitle: product.subtitle,
    description: product.description,
    features: product.features || [],
    inStock: product.inStock,
  };
}

function serializeTraining(training, req, extra = {}) {
  return {
    id: training.id,
    title: training.title,
    subtitle: training.subtitle,
    eventDate: training.eventDate,
    dateLabel: formatDate(training.eventDate),
    timeLabel: training.timeLabel,
    capacity: training.capacity,
    fee: training.fee,
    joined: extra.joined ?? 0,
    image: publicUrl(req, training.imageUrl),
    imageUrl: publicUrl(req, training.imageUrl),
  };
}

function serializeCompetition(competition, req, extra = {}) {
  return {
    id: competition.id,
    title: competition.title,
    subtitle: competition.subtitle,
    dateLabel: formatDate(competition.eventDate),
    eventDate: competition.eventDate,
    location: competition.location,
    image: publicUrl(req, competition.imageUrl),
    imageUrl: publicUrl(req, competition.imageUrl),
    joined: extra.joined ?? 0,
    capacity: competition.capacity,
    fee: competition.fee,
    about: competition.about,
    facts: competition.facts || [],
    tags: competition.tags || [],
    status: extra.registered ? 'registered' : competition.status,
    registered: Boolean(extra.registered),
  };
}

function serializeMember(member, req) {
  const type = member.MemberType;
  const activity = member.DevelopmentActivity;
  const parent = member.parent;
  return {
    id: member.id,
    name: member.name,
    memberCode: member.memberCode,
    phone: member.phone,
    avatarUrl: publicUrl(req, member.avatarUrl),
    motto: member.motto,
    level: member.level,
    rank: member.rank,
    competitionCount: member.competitionCount,
    validFrom: member.validFrom,
    validTo: member.validTo,
    validFromLabel: formatDate(member.validFrom),
    validToLabel: formatDate(member.validTo),
    status: member.status,
    walletBalance: member.walletBalance,
    memberTypeId: member.memberTypeId,
    developmentActivityId: member.developmentActivityId,
    parentId: member.parentId,
    parentName: member.parentName || parent?.name || null,
    parentPhone: member.parentPhone || parent?.phone || null,
    parentEmail: member.parentEmail || null,
    memberType: type
      ? {
          id: type.id,
          name: type.name,
          slug: type.slug,
          category: type.category,
          level: type.level,
          requiresParent: type.requiresParent,
          hasAppAccess: type.hasAppAccess,
          isInactive: type.isInactive,
        }
      : null,
    developmentActivity: activity
      ? { id: activity.id, name: activity.name, slug: activity.slug }
      : null,
  };
}

module.exports = {
  publicUrl,
  formatDate,
  formatTime,
  serializeProduct,
  serializeCompetition,
  serializeTraining,
  serializeMember,
};
