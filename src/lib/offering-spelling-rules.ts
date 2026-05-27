/**
 * Spelling and style rules from Commonly_misspelt_words.xlsx
 * (sheet: "Correct spelling of common word").
 */

export const OFFERING_SPELLING_GENERAL_RULES = [
  "All Sanskrit and Hindi words must be in italics. Wrap them in <em> if they are not already italicized, without changing surrounding HTML structure.",
  'Use "All glories to Srila Prabhupada!" with an exclamation mark at the end when that phrase appears.',
] as const;

/** Incorrect form(s) → correct form. Comma-separated incorrect values are alternate misspellings. */
export const OFFERING_SPELLING_REPLACEMENTS: ReadonlyArray<{
  incorrect: string;
  correct: string;
  note?: string;
}> = [
  { incorrect: "acarya", correct: "acharya" },
  { incorrect: "apradh", correct: "aparadha" },
  {
    incorrect:
      "Bhagavadgita, Bhagavad gita, Bhagvat Gita, Bhagvad Gita",
    correct: "Bhagavad-gita",
  },
  { incorrect: "bonafide", correct: "bona fide" },
  { incorrect: "bramhachari", correct: "brahmacari" },
  { incorrect: "brahman", correct: "brahmana" },
  { incorrect: "Bhagavatpad", correct: "Bhagavatpada" },
  { incorrect: "Chaitanya", correct: "Caitanya" },
  {
    incorrect: "Chaitanya charitamrita",
    correct: "Caitanya-caritamrta",
    note: "May abbreviate as C.c. where appropriate.",
  },
  { incorrect: "Dandwat", correct: "dandavat" },
  { incorrect: "das", correct: "dasa" },
  { incorrect: "diety", correct: "Deity" },
  { incorrect: "DD, Devi Dasi", correct: "devi dasi" },
  { incorrect: "dham", correct: "dhama" },
  { incorrect: "ekadashi", correct: "Ekadashi" },
  { incorrect: "god brother", correct: "god-brother" },
  { incorrect: "god sister", correct: "god-sister" },
  { incorrect: "grihastha", correct: "grhasta" },
  { incorrect: "Gaur Nitai", correct: "Gaur-Nitai" },
  {
    incorrect: "Guru Maharaj",
    correct: "Guru Maharaja",
    note: "Only when addressing Guru Maharaja directly.",
  },
  {
    incorrect: "guru maharaj",
    correct: "guru maharaja",
    note: "When used in the body of a paragraph.",
  },
  { incorrect: "Guru ashtakam", correct: "Gurv-astakam" },
  { incorrect: "Gurudev", correct: "Gurudeva" },
  { incorrect: "Hari bhakti vilas", correct: "Hari Bhakti Vilas" },
  {
    incorrect: "Hari bhakti sudhodaya",
    correct: "Hari-bhakti-sudhodaya",
  },
  { incorrect: "harinaam", correct: "harinama" },
  { incorrect: "Holy Name", correct: "holy name" },
  { incorrect: "ISKCON", correct: "Iskcon" },
  { incorrect: "jai", correct: "jaya" },
  { incorrect: "Kaliyuga", correct: "Kali-yuga" },
  {
    incorrect: "Krishna Consciousness",
    correct: "Krishna consciousness",
  },
  { incorrect: "Krishna prema", correct: "Krishna-prema" },
  { incorrect: "Lotus Feet", correct: "lotus feet" },
  { incorrect: "Leela", correct: "lila" },
  { incorrect: "Madhya leela", correct: "Madhya-lila" },
  { incorrect: "mahamantra", correct: "maha-mantra" },
  { incorrect: "maha prasad", correct: "maha-prasad" },
  {
    incorrect: "mangalarati, mangala arati, Mangla Arti",
    correct: "mangala-arati",
  },
  { incorrect: "obiesances", correct: "obeisances" },
  { incorrect: "Panchatattva", correct: "Pancha-tattva" },
  { incorrect: "patita pavana", correct: "patita-pavana" },
  { incorrect: "pranaam", correct: "pranam" },
  { incorrect: "prem", correct: "prema" },
  { incorrect: "Radha rani", correct: "Radharani" },
  { incorrect: "sanyas", correct: "sannyasa" },
  { incorrect: "sanyasi", correct: "sannyasi" },
  { incorrect: "sewa", correct: "seva" },
  { incorrect: "shiksha", correct: "siksha" },
  { incorrect: "shloka", correct: "sloka" },
  { incorrect: "Spiritual Master", correct: "spiritual master" },
  { incorrect: "Shrila", correct: "Srila" },
  { incorrect: "Shri", correct: "Sri" },
  {
    incorrect: "Shri Shri Radha Rasabihari",
    correct: "Sri Sri Radha-Rasabihari",
  },
  {
    incorrect: "Shrila Bhagavatpad",
    correct: "Srila Bhagavatpada",
  },
  { incorrect: "Srila Prabhupad", correct: "Srila Prabhupada" },
  {
    incorrect: "Shrimad Bhagawatam",
    correct: "Srimad-Bhagavatam",
    note: "May abbreviate as S.B. where appropriate.",
  },
  { incorrect: "Shikshastakam", correct: "Sikastakam" },
  { incorrect: "supreme lord", correct: "Supreme Lord" },
  { incorrect: "their lordships", correct: "Their Lordship" },
  { incorrect: "Vaisnava", correct: "Vaishnava" },
  { incorrect: "veda", correct: "Veda" },
  { incorrect: "vedic", correct: "Vedic" },
  {
    incorrect: "Vyasa puja, Vyasa pooja, Vyas Puja",
    correct: "Vyasa-puja",
  },
];

/** Preferred spellings when these Vaishnava terms appear (from the spreadsheet). */
export const OFFERING_PREFERRED_SPELLINGS = [
  "anartha",
  "bhakta",
  "darshan",
  "diksha",
  "jiva",
  "kripa",
  "maya",
  "offenses",
  "parampara",
  "prasadam",
  "sadhana",
  "sadhu",
  "sankirtana",
  "shastra",
  "Supreme Personality of Godhead",
  "vani",
  "vapu",
] as const;

function formatReplacementRule(
  rule: (typeof OFFERING_SPELLING_REPLACEMENTS)[number],
  index: number,
): string {
  const variants = rule.incorrect
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const variantList =
    variants.length > 1
      ? `any of: ${variants.map((v) => `"${v}"`).join(", ")}`
      : `"${variants[0]}"`;
  const note = rule.note ? ` (${rule.note})` : "";
  return `${index + 1}. Replace ${variantList} with "${rule.correct}"${note}.`;
}

/** Builds the "Additional Custom Rules" block for the grammar-review prompt. */
export function formatOfferingSpellingRulesForPrompt(): string {
  const general = OFFERING_SPELLING_GENERAL_RULES.map(
    (r, i) => `${i + 1}. ${r}`,
  ).join("\n");

  const replacements = OFFERING_SPELLING_REPLACEMENTS.map(formatReplacementRule).join(
    "\n",
  );

  const preferred = OFFERING_PREFERRED_SPELLINGS.map((w) => `"${w}"`).join(", ");

  return `General style (from editorial guidelines):
${general}

Commonly misspelt words — apply these replacements when the incorrect form appears (match case-insensitively unless the correct form specifies capitalization):
${replacements}

Preferred spellings for these terms when they appear:
${preferred}`;
}
