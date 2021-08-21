import React from 'react'
import ReactCurrencyInputField from 'react-currency-input-field'

function CurrencyInput({
  currencyPrefix = false,
  currencySuffix = false,
  currencySymbol = 'Q',
  currencyFormat = 'de-DE',
  fractionDigit = 2,
  className = '',
  ...props
}) {
  // currencyFormat = 'de-DE' usa punto para miles y coma para decimales
  // currencyFormat = 'en-US' usa coma para miles y punto para decimales
  const fractionSeparator = currencyFormat === 'de-DE' ? ',' : '.'
  const groupSeparator = currencyFormat === 'de-DE' ? '.' : ','

  return (
    <ReactCurrencyInputField
      prefix={currencyPrefix ? <div>{currencySymbol}</div> : null}
      suffix={currencySuffix ? <div>{currencySymbol}</div> : null}
      size={'large'}
      {...props}
      className={`ant-input ant-input-lg ${className}`}
      fixedDecimalLength={fractionDigit}
      decimalsLimit={fractionDigit}
      decimalSeparator={fractionSeparator}
      groupSeparator={groupSeparator}
    />
  )
}

export default CurrencyInput
