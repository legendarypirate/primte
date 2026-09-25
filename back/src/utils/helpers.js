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
  const images = (product.images?.length ? product.images : [product.imageUrl])
    .filter(Boolean)
    .map((path) => publicUrl(req, path));
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: images[0] || null,
    imageUrl: images[0] || null,
    images,
    category: product.category,
    categoryLabel: product.categoryLabel,
    subtitle: product.subtitle,
    description: product.description,
    features: product.features || [],
    inStock: product.inStock,
    relatedIds: product.relatedIds || [],
    sortOrder: product.sortOrder,
  };
}

function serializeProductCategory(category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    sortOrder: category.sortOrder,
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

function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return `${formatDate(d)} ${formatTime(d)}`;
}

function dateRangeLabel(start, end) {
  if (!start) return '';
  if (!end || end === start) return formatDate(start);
  const s = new Date(start);
  const e = new Date(end);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    const y = s.getFullYear();
    const m = String(s.getMonth() + 1).padStart(2, '0');
    return `${y}.${m}.${String(s.getDate()).padStart(2, '0')} – ${String(e.getDate()).padStart(2, '0')}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function buildCompetitionFacts(competition) {
  if (Array.isArray(competition.facts) && competition.facts.length) {
    return competition.facts;
  }
  const facts = [];
  if (competition.organizer) {
    facts.push({ icon: 'group', title: 'Зохион байгуулагч', body: competition.organizer });
  }
  if (competition.location) {
    facts.push({ icon: 'location', title: 'Байршил', body: competition.location });
  }
  if (competition.level) {
    facts.push({ icon: 'level', title: 'Түвшин', body: competition.level });
  }
  if (competition.eventDate) {
    facts.push({
      icon: 'calendar',
      title: 'Огноо',
      body: dateRangeLabel(competition.eventDate, competition.eventEndDate),
    });
  }
  if (competition.stageCount) {
    facts.push({ icon: 'target', title: 'Стэйж', body: String(competition.stageCount) });
  }
  if (competition.minShots) {
    facts.push({ icon: 'shots', title: 'Мин. буудалт', body: `${competition.minShots}+` });
  }
  if (competition.fee) {
    facts.push({ icon: 'fee', title: 'Хураамж', body: `${competition.fee.toLocaleString()} ₮` });
  }
  return facts;
}

function serializeCompetition(competition, req, extra = {}) {
  const registration = extra.registration || null;
  const regStatus = registration?.status;
  const isRegistered = Boolean(extra.registered || registration);
  let status = competition.status;
  if (isRegistered) {
    if (regStatus === 'waitlist' || regStatus === 'pending') status = 'waitlist';
    else if (regStatus === 'confirmed' || regStatus === 'paid') status = 'registered';
    else status = 'registered';
  }

  return {
    id: competition.id,
    title: competition.title,
    subtitle: competition.subtitle,
    dateLabel: dateRangeLabel(competition.eventDate, competition.eventEndDate) || formatDate(competition.eventDate),
    eventDate: competition.eventDate,
    eventEndDate: competition.eventEndDate,
    registrationOpenAt: competition.registrationOpenAt,
    registrationCloseAt: competition.registrationCloseAt,
    registrationOpenLabel: formatDateTime(competition.registrationOpenAt),
    registrationCloseLabel: formatDateTime(competition.registrationCloseAt),
    location: competition.location,
    organizer: competition.organizer,
    image: publicUrl(req, competition.imageUrl),
    imageUrl: publicUrl(req, competition.imageUrl),
    joined: extra.joined ?? 0,
    capacity: competition.capacity,
    fee: competition.fee,
    level: competition.level,
    stageCount: competition.stageCount,
    minShots: competition.minShots,
    about: competition.about,
    prizes: competition.prizes,
    rules: competition.rules,
    requirements: competition.requirements || [],
    refundPolicy: competition.refundPolicy || [],
    extraInfo: competition.extraInfo,
    mdName: competition.mdName,
    mdPhone: competition.mdPhone,
    mdEmail: competition.mdEmail,
    squadCapacity: competition.squadCapacity,
    squadsPerShift: competition.squadsPerShift,
    lateRegistrationNote: competition.lateRegistrationNote,
    matchTypeId: competition.matchTypeId,
    matchType: extra.matchType || (competition.MatchType
      ? { id: competition.MatchType.id, name: competition.MatchType.name, comment: competition.MatchType.comment }
      : null),
    divisionIds: competition.divisionIds || [],
    divisions: extra.divisions || [],
    categories: competition.categories || [],
    squads: competition.squads || [],
    schedule: competition.schedule || [],
    facts: buildCompetitionFacts(competition),
    tags: competition.tags || [],
    status,
    registered: isRegistered,
    registration: registration ? serializeRegistration(registration) : null,
  };
}

function serializeRegistration(registration) {
  const member = registration.Member;
  const division = registration.Division;
  return {
    id: registration.id,
    memberId: registration.memberId,
    competitionId: registration.competitionId,
    divisionId: registration.divisionId,
    category: registration.category,
    squadLabel: registration.squadLabel,
    status: registration.status,
    paymentReference: registration.paymentReference,
    feePaid: registration.feePaid,
    createdAt: registration.createdAt,
    member: member
      ? {
          id: member.id,
          name: member.name,
          memberCode: member.memberCode,
          phone: member.phone,
        }
      : null,
    division: division
      ? {
          id: division.id,
          abbreviation: division.abbreviation,
          name: division.name,
        }
      : null,
  };
}

function serializeChildSummary(member, req, extra = {}) {
  const type = member.MemberType;
  return {
    id: member.id,
    name: member.name,
    memberCode: member.memberCode,
    avatarUrl: publicUrl(req, member.avatarUrl),
    level: member.level,
    rank: member.rank,
    status: member.status,
    walletBalance: member.walletBalance,
    memberTypeName: type?.name || 'Junior Athlete',
    category: type?.category || 'junior',
    validFromLabel: formatDate(member.validFrom),
    validToLabel: formatDate(member.validTo),
    attendancePercent: extra.attendancePercent ?? 92,
    competitionCount: member.competitionCount,
  };
}

function serializeAttendance(record) {
  const start = new Date(record.createdAt);
  const end = record.checkOutAt ? new Date(record.checkOutAt) : null;
  const isToday = start.toDateString() === new Date().toDateString();
  return {
    id: record.id,
    title: isToday ? 'Өнөөдөр' : formatDate(start),
    subtitle: record.title || 'Клубт ирсэн',
    kind: record.kind,
    dateLabel: formatDate(start),
    timeLabel: end ? `${formatTime(start)} - ${formatTime(end)}` : formatTime(start),
  };
}

function serializeProgress(progress) {
  return {
    accuracy: progress.accuracy,
    speed: progress.speed,
    stability: progress.stability,
    tactical: progress.tactical,
    safety: progress.safety,
    period: progress.period,
    history: [
      {
        label: 'Нарийвчлал',
        delta: `${progress.accuracyDelta >= 0 ? '+' : ''}${progress.accuracyDelta}%`,
        period: 'Сүүлийн 3 сар',
      },
    ],
  };
}

function serializePurchase(item, order, req) {
  const product = item.Product;
  const category = product?.category || 'store';
  const categoryLabels = {
    bb: 'Дэлгүүр',
    gas: 'Дэлгүүр',
    clothing: 'Дэлгүүр',
    accessory: 'Дэлгүүр',
    store: 'Дэлгүүр',
    training: 'Сургалт',
    competition: 'Тэмцээн',
  };
  return {
    id: item.id,
    title: item.name,
    amount: item.price * item.quantity,
    dateLabel: formatDate(order.createdAt),
    category,
    categoryLabel: categoryLabels[category] || 'Дэлгүүр',
    image: publicUrl(req, product?.imageUrl),
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
    hasPassword: Boolean(member.passwordHash),
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
  formatDateTime,
  dateRangeLabel,
  serializeProduct,
  serializeProductCategory,
  serializeCompetition,
  serializeRegistration,
  serializeTraining,
  serializeMember,
  serializeChildSummary,
  serializeAttendance,
  serializeProgress,
  serializePurchase,
};
