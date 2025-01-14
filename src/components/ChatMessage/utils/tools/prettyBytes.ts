const UNITS = ['byte', 'K', 'M', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

/*
Formats the given number using `Number#toLocaleString`.
- If locale is a string, the value is expected to be a locale-key (for example: `de`).
- If locale is true, the system default locale is used for translation.
- If no value for locale is specified, the number is returned unmodified.
*/
const toLocaleString = (number: number, locale: string): string => {
  let result = number + "";
  if (typeof locale === 'string') {
    result = number.toLocaleString(locale);
  } else if (locale === true) {
    result = number.toLocaleString();
  }

  return result;
};

const prettyBytes = (number: number, options?: any) => {
  if (!Number.isFinite(number)) {
    throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
  }

  options = Object.assign({}, options);

  if (options.signed && number === 0) {
    return ' 0 B';
  }

  const isNegative = number < 0;
  const prefix = isNegative ? '-' : options.signed ? '+' : '';

  if (isNegative) {
    number = -number;
  }

  if (number < 1) {
    const numberString = toLocaleString(number, options.locale);
    return prefix + numberString + 'byte';
  }

  const exponent = Math.min(Math.floor(Math.log10(number) / 3), UNITS.length - 1);
  // eslint-disable-next-line unicorn/prefer-exponentiation-operator
  const fixed = exponent < 2 ? 0 : 1;
  number = Number((number / Math.pow(1024, exponent)).toFixed(fixed)); // K不保留小数，其他1位小数
  const numberString = toLocaleString(number, options.locale);

  const unit = UNITS[exponent];

  return prefix + numberString + '' + unit;
};

export default prettyBytes
