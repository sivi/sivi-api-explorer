const LANGUAGES_CODE_MAP = {
  en: 'english',
  ar: 'arabic',
  bn: 'bengali',
  zh: 'chinese',
  hi: 'hindi',
  el: 'greek',
  he: 'hebrew',
  kn: 'kannada',
  km: 'khmer',
  ko: 'korean',
  ml: 'malayalam',
  my: 'burmese',
  or: 'oriya',
  si: 'sinhala',
  ta: 'tamil',
  te: 'telugu',
  th: 'thai',
  bo: 'tibetan',
  vi: 'vietnamese',
  es: 'spanish',
  de: 'german',
  fr: 'french',
  pt: 'portuguese',
  ur: 'urdu',
  id: 'indonesian',
  mr: 'marathi',
  tr: 'turkish',
  af: 'afrikaans',
  sq: 'albanian',
  as: 'assamese',
  az: 'azerbaijani',
  eu: 'basque',
  bg: 'bulgarian',
  ca: 'catalan',
  hr: 'croatian',
  da: 'danish',
  nl: 'dutch',
  et: 'estonian',
  fi: 'finnish',
  gl: 'galician',
  hu: 'hungarian',
  ig: 'igbo',
  it: 'italian',
  lv: 'latvian',
  lt: 'lithuanian',
  mk: 'macedonian',
  mg: 'malagasy',
  ne: 'nepali',
  om: 'oromo',
  pl: 'polish',
  pa: 'punjabi',
  ro: 'romanian',
  ru: 'russian',
  sr: 'serbian',
  sn: 'shona',
  sk: 'slovak',
  so: 'somali',
  sv: 'swedish',
  bs: 'bosnian',
  cs: 'czech',
  eo: 'esperanto',
  ee: 'ewe',
  fil: 'filipino',
  cy: 'welsh',
  yo: 'yoruba',
  zu: 'zulu',
  kok: 'konkani',
  sl: 'slovenian',
  haw: 'hawaiian',
  rw: 'kinyarwanda',
  lb: 'luxembourgish',
  mt: 'maltese',
  sw: 'swahili',
  uz: 'uzbek',
  fa: 'persian',
  hy: 'armenian',
  is: 'icelandic',
  ga: 'irish',
  ln: 'lingala',
  ps: 'pashto',
  yi: 'yiddish',
  gu: 'gujarati',
  ja: 'japanese',
  gd: 'scottish gaelic',
  no: 'norwegian',
  fo: 'faroese',
  kea: 'kabuverdianu',
  mak: 'makonde',
  kln: 'kalenjin',
  fur: 'friulian',
};

export const getSupportedLanguageList = () => {
  const list = [];
  for (const key in LANGUAGES_CODE_MAP) {
    list.push({
      languageCode: key,
      languageName: LANGUAGES_CODE_MAP[key],
    });
  }
  list.sort((a, b) => {
    const nameA = a.languageName.toUpperCase();
    const nameB = b.languageName.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  return list;
};

export const getLanguageOptions = () => {
  return getSupportedLanguageList().map((lang) => ({
    value: lang.languageName,
    label: lang.languageName.charAt(0).toUpperCase() + lang.languageName.slice(1),
  }));
};

export { LANGUAGES_CODE_MAP };
