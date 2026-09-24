const MESSAGES = {
  TIME_POSITIVE: 'Цаг 0-ээс их байх ёстой.',
  SCORE_INCOMPLETE: 'Онооны мэдээлэл дутуу байна.',
  DUPLICATE_SCORE: 'Энэ тамирчин энэ шатанд аль хэдийн оноо авсан байна.',
  VERSION_CONFLICT: 'Онооны хувилбар зөрчил илэрлээ.',
  ALREADY_CONFIRMED: 'Энэ оноо аль хэдийн баталгаажсан байна.',
  DIVISION_NOT_CONFIGURED: 'Division тохируулаагүй байна.',
  STAGE_NOT_FOUND: 'Шат олдсонгүй.',
  COMPETITOR_NOT_FOUND: 'Тамирчин олдсонгүй.',
  SYNC_FAILED: 'Синк амжилтгүй боллоо.',
  MATCH_FINALIZED: 'Тэмцээн эцэслэгдсэн тул засвар хийх боломжгүй.',
  NEGATIVE_VALUE: 'Сөрөг утга зөвшөөрөгдөхгүй.',
  WRONG_MATCH: 'Тамирчин эсвэл шат энэ тэмцэнд хамаарахгүй.',
};

function validateScoreInput(input) {
  const errors = [];
  if (!input.timeSeconds || input.timeSeconds <= 0) {
    errors.push(MESSAGES.TIME_POSITIVE);
  }
  const intFields = [
    ['alphaHits', 'A'],
    ['charlieHits', 'C'],
    ['deltaHits', 'D'],
    ['missCount', 'Miss'],
    ['noShootCount', 'No Shoot'],
    ['proceduralCount', 'Procedural'],
  ];
  for (const [field] of intFields) {
    const val = input[field];
    if (val == null) continue;
    if (val < 0 || !Number.isInteger(val)) {
      errors.push(MESSAGES.NEGATIVE_VALUE);
      break;
    }
  }
  if (input.otherPenaltyPoints != null && input.otherPenaltyPoints < 0) {
    errors.push(MESSAGES.NEGATIVE_VALUE);
  }
  return errors;
}

module.exports = {
  MESSAGES,
  validateScoreInput,
};
