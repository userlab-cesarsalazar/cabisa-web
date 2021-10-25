// import React from 'react'
// import ReactCurrencyInputField from 'react-currency-input-field'

// function CurrencyInput({
//   currencyPrefix = false,
//   currencySuffix = false,
//   currencySymbol = 'Q',
//   currencyFormat = 'en-US',
//   fractionDigit = 2,
//   className = '',
//   ...props
// }) {
//   // currencyFormat = 'de-DE' usa punto para miles y coma para decimales
//   // currencyFormat = 'en-US' usa coma para miles y punto para decimales
//   const fractionSeparator = currencyFormat === 'de-DE' ? ',' : '.'
//   const groupSeparator = currencyFormat === 'de-DE' ? '.' : ','

//   return (
//     <ReactCurrencyInputField
//       prefix={currencyPrefix ? <div>{currencySymbol}</div> : null}
//       suffix={currencySuffix ? <div>{currencySymbol}</div> : null}
//       size={'large'}
//       {...props}
//       className={`ant-input ant-input-lg ${className}`}
//       fixedDecimalLength={fractionDigit}
//       decimalsLimit={fractionDigit}
//       decimalSeparator={fractionSeparator}
//       groupSeparator={groupSeparator}
//     />
//   )
// }

// export default CurrencyInput

import React, { useState, useEffect } from 'react'
import { Input } from 'antd'
/*
<CurrencyInput
  placeholder={'Escribir TEST'}
  size={'large'}
  style={{ height: '40px' }}
  value={test}
  onChange={value => setTest(value)}
  currencyFormat='en-US'
  minimumFractionDigits={2}
  maximumFractionDigits={2}
  currencyPrefix={true}
  currencySuffix={false}
/>
*/

const numberFormat = ({ currencyFormat, fractionDigits } = {}) => {
  // currencyFormat = 'de-DE' usa punto para miles y coma para decimales
  // currencyFormat = 'en-US' usa coma para miles y punto para decimales
  const fractionSeparator = currencyFormat === 'de-DE' ? ',' : '.'
  const groupSeparator = currencyFormat === 'de-DE' ? '.' : ','

  const toRegExp = function (val) {
    const escaped = val.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    return new RegExp(escaped, 'g')
  }

  const getFormattedValue = (value, minimumFractionDigitsOnBlur = 0) => {
    if (!value || isNaN(Number(value))) return value

    return new Intl.NumberFormat(currencyFormat, {
      minimumFractionDigits: minimumFractionDigitsOnBlur,
      maximumFractionDigits: fractionDigits,
    }).format(value)
  }

  const getValue = inputValue => {
    const result = String(inputValue)
      .replace(toRegExp(groupSeparator), '')
      .replace(fractionSeparator, '.')

    return Number(result)
  }

  return {
    getFormattedValue,

    getValue,

    lastCharIsFractionSeparator: input => {
      const inputLength = input?.length

      if (inputLength) return input[inputLength - 1] === fractionSeparator
      else return null
    },

    handleChange: (prevValue, rawValue) => {
      const allowedCharacters = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        fractionSeparator,
        groupSeparator,
      ]

      if (!rawValue && rawValue !== '') return ''

      const qtyOfFractionSeparators = String(rawValue)
        .split('')
        .reduce((r, v) => (r += v === fractionSeparator ? 1 : 0), 0)

      if (qtyOfFractionSeparators > 1) return prevValue

      const validatedValue = String(rawValue)
        .split('')
        .reduce(
          (r, v) => `${r}${allowedCharacters.some(ac => ac === v) ? v : ''}`,
          ''
        )
      const decimals = validatedValue.split(fractionSeparator)[1]
      const lastValueChar = validatedValue[validatedValue.length - 1]

      const value = getValue(validatedValue)
      const formattedValue =
        (lastValueChar === fractionSeparator || lastValueChar === '0') &&
        decimals?.length <= 2
          ? validatedValue
          : getFormattedValue(value)

      return formattedValue
    },

    handleBlur: rawValue => {
      const value = getValue(rawValue)
      const formattedValue = getFormattedValue(value, fractionDigits)

      return formattedValue
    },
  }
}

function CurrencyInput({
  currencyPrefix = false,
  currencySuffix = false,
  currencySymbol = 'Q',
  currencyFormat = 'en-US',
  fractionDigits = 2,
  ...props
}) {
  const { getFormattedValue, handleChange, handleBlur } = numberFormat({
    // const { getFormattedValue } = numberFormat({
    currencyFormat,
    fractionDigits,
  })

  const [_inputValue, _setInputValue] = useState('')

  useEffect(() => {
    const value =
      typeof props.value === 'number'
        ? getFormattedValue(props.value)
        : props.value

    if (_inputValue === value) return

    _setInputValue(value)
  }, [_inputValue, props.value, getFormattedValue])

  const _handleChange = e => {
    if (!props.onChange) return

    if (typeof props.onChange !== 'function')
      throw new Error('The prop onChange must be a function')

    const rawValue = e?.target?.value || ''
    const formattedValue = handleChange(_inputValue, rawValue)

    props.onChange(formattedValue)
    // props.onChange(rawValue)
  }

  const _handleBlur = e => {
    const rawValue = e?.target?.value || ''

    const formattedValue = handleBlur(rawValue)
    // typeof props.onChange === 'function' && props.onChange(formattedValue)
    typeof props.onBlur === 'function' && props.onBlur(formattedValue)
  }

  return (
    <Input
      prefix={currencyPrefix ? <div>{currencySymbol}</div> : null}
      suffix={currencySuffix ? <div>{currencySymbol}</div> : null}
      {...props}
      type='text'
      value={_inputValue}
      onChange={_handleChange}
      onBlur={_handleBlur}
    />
    // <Input {...props} type='tel' value={props.value} onChange={_handleChange} />
  )
}

export default CurrencyInput
