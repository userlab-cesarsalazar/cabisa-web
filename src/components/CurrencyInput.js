import React, { useState } from 'react'
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

const numberFormat = ({
  currencyFormat,
  minimumFractionDigits,
  maximumFractionDigits,
} = {}) => {
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
      maximumFractionDigits,
    }).format(value)
  }

  const getValue = formattedValue => {
    const result = String(formattedValue)
      .replace(toRegExp(groupSeparator), '')
      .replace(fractionSeparator, groupSeparator)

    return Number(result)
  }

  return {
    getFormattedValue,

    getValue,

    handleChange: rawValue => {
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

      if (!rawValue && rawValue !== '') return { value: 0, formattedvalue: '' }

      const qtyOfFractionSeparators = String(rawValue)
        .split('')
        .reduce((r, v) => (r += v === fractionSeparator ? 1 : 0), 0)

      if (qtyOfFractionSeparators > 1)
        return { value: null, formattedvalue: null }

      const validatedValue = String(rawValue)
        .split('')
        .reduce(
          (r, v) => `${r}${allowedCharacters.some(ac => ac === v) ? v : ''}`,
          ''
        )
      const decimals = validatedValue.split(fractionSeparator)[1]
      const lastValueChar = validatedValue[validatedValue.length - 1]

      const value = getValue(validatedValue)
      const formattedvalue =
        (lastValueChar === fractionSeparator || lastValueChar === '0') &&
        decimals?.length <= 2
          ? validatedValue
          : getFormattedValue(value)

      return { value, formattedvalue }
    },

    handleBlur: rawValue => {
      const value = getValue(rawValue)
      const formattedvalue = getFormattedValue(value, minimumFractionDigits)

      return formattedvalue
    },
  }
}

function CurrencyInput({
  currencyPrefix = true,
  currencySymbol = 'Q',
  currencyFormat = 'de-DE',
  minimumFractionDigits = 2,
  maximumFractionDigits = 2,
  ...props
}) {
  const { getFormattedValue, handleChange, handleBlur } = numberFormat({
    currencyFormat,
    minimumFractionDigits,
    maximumFractionDigits,
  })

  const [_inputValue, _setInputValue] = useState(getFormattedValue(props.value))

  const _handleChange = e => {
    if (!props.onChange) return

    if (typeof props.onChange !== 'function')
      throw new Error('The prop onChange must be a function')

    const rawValue = e?.target?.value || ''
    const { formattedvalue, value } = handleChange(rawValue)

    _setInputValue(formattedvalue ?? _inputValue)
    props.onChange(value ?? props.value)
  }

  const _handleBlur = e => {
    const rawValue = e?.target?.value || ''

    const formattedvalue = handleBlur(rawValue)
    _setInputValue(formattedvalue)
  }

  return (
    <Input
      prefix={currencyPrefix ? <div>{currencySymbol}</div> : null}
      suffix={props.currencySuffix ? <div>{currencySymbol}</div> : null}
      {...props}
      value={_inputValue}
      onChange={_handleChange}
      onBlur={_handleBlur}
    />
  )
}

export default CurrencyInput
