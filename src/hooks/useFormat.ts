/* 
数值/人民币格式化
*/

function formatNumber(value: any) {
  if (!value) return ''
  return `${value}`.replace(/(\d{3})(?=\d)/g, '$1,')
}

export default function useFormat() {
  const numberFormat = (value: any) => formatNumber(value)
  const moneyFormat = (value: any) => `¥ ${formatNumber(value)}`

  return {
    numberFormat,
    moneyFormat
  }
}