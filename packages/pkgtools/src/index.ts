/* eslint-disable @typescript-eslint/no-explicit-any */
export const normalizeUnit = (value: number) => {
  let unit = '';
  let formatValue = 0;
  let step = 1000;
  let num = 3;

  while (value / step >= 1) {
    step *= 10;
    num += 1;
  }
  if (num <= 4) {
    // 千
    unit = '千';
    formatValue = value / 1000;
  } else if (num <= 8) {
    // 万
    const text = parseInt((num - 4) as unknown as string, 10) / 3 > 1 ? '千万' : '万';
    const step = '万' === text ? 10000 : 10000000;
    unit = text;
    formatValue = value / step;
  } else if (num <= 16) {
    // 亿
    let text = (num - 8) / 3 > 1 ? '千亿' : '亿';
    text = (num - 8) / 4 > 1 ? '万亿' : text;
    text = (num - 8) / 7 > 1 ? '千万亿' : text;
    let step = 1;
    if ('亿' === text) {
      step = 100000000;
    } else if ('千亿' === text) {
      step = 100000000000;
    } else if ('万亿' === text) {
      step = 1000000000000;
    } else if ('千万亿' === text) {
      step = 1000000000000000;
    }
    unit = text;
    formatValue = value / step;
  }
  if (value < 1000) {
    unit = '';
    formatValue = value;
  }

  formatValue = Math.round(formatValue * 100) / 100;
  return {
    unit,
    value: formatValue,
  };
};
/**
 * 四舍五入
 * @param {*} number
 * @param {*} digit
 * @returns
 */
export const toFixed = (number: number, digit = 0) => {
  if (digit > 20 || digit < 0) {
    throw new RangeError('toFixed() digits argument must be between 0 and 20');
  }
  if (isNaN(number) || number >= Math.pow(10, 21)) {
    return number.toString();
  }
  if (typeof digit === 'undefined' || digit === 0) {
    return Math.round(number).toString();
  }

  let result = number.toString();
  const numbers = result.split('.');

  // 只有整数的情况
  if (numbers.length === 1) {
    result += '.';
    for (let i = 0; i < digit; i++) {
      result += '0';
    }
    return result;
  }

  const [integer, decimal] = numbers;

  if (decimal.length === digit) {
    return result;
  }

  if (decimal.length < digit) {
    for (let i = 0; i < digit - decimal.length; i++) {
      result += '0';
    }
    return result;
  }

  result = `${integer}.${decimal.substr(0, digit)}`;
  const last = decimal.substr(digit, 1);

  // 四舍五入，转换为整数再处理，避免浮点数精度的损失
  if (parseInt(last, 10) >= 5) {
    const x = Math.pow(10, digit);
    // Math.round 在处理负数小数位的四舍五入存在问题 如： Math.round(-20.5) 会返回 -20
    const num = parseFloat(result) * x;
    if (num < 0) {
      result = ((Math.round(num) - 1) / x) as unknown as string;
    } else {
      result = ((Math.round(num) + 1) / x) as unknown as string;
    }
    result = toFixed(result as unknown as number, digit);
  }

  return result;
};

/**
 * 超过1W的数字显示万结尾
 * @param {Number} value
 * @returns {String}
 */
export function fixedToWByValueNum(value: number, isUnit: any, defUnit = '') {
  const minFixedValue = 10000;
  if (isNaN(Number(value))) return value;
  if (value < minFixedValue) return isUnit ? { num: toFixed(value), unit: '单' } : toFixed(value);
  const { unit: resUnit, value: resValue } = normalizeUnit(value);
  return isUnit
    ? { num: resValue.toFixed(1), unit: `${resUnit}${defUnit}` }
    : `${resValue.toFixed(1)}${resUnit}`;
}

/**
 * 数值转百分比
 * @param {} value 处理数据
 * @param {*} fixed  保留几位小数
 * @param {*} isResObj  是否返回对象数据
 *
 * 结果 ：
 * {
 *   status, -1 || 0 || 1
 *   value: '10%'
 * }
 */
export function formatToPer(value: string, fixed = 1, isResObj = true, rounding: any) {
  if (
    value === 'undefined'
    || isNaN(Number(value))
    || (value !== '0' && !value)
  ) return null;
  let res = Number(value);
  let status = 0;
  if (res < 0) status = -1;
  else if (res > 0) status = 1;
  let num = Math.abs(res);

  if (rounding) {
    // res = (num * 100).toFixed(fixed);
    res = Math.round(num * 100 * (fixed * 10)) / (fixed * 10);
  } else {
    num = parseInt(num * 1000 as unknown as string, 10);
    res = Math.round((num / 10) * (fixed * 10)) / (fixed * 10);
    // res = (num / 10).toFixed(fixed);
  }
  if ((res === 0 || res === 0.0) && Number(value) !== 0) {
    res = 0.1;
  }
  res = res.toFixed(fixed) as unknown as number;
  return isResObj ? { status, value: `${res}%` } : `${res}%`;
}
