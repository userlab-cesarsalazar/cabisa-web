import React, { useEffect, useState } from 'react'
import { Input } from 'antd'
import { numberFormat } from '../utils'

const CurrencyInput = ({
  showPrefix = false,
  showSuffix = false,
  currencySymbol = 'Q',
  currencyFormat = 'de-DE',
  fractionDigits = 2,
  ...props
}) => {
  const { getFormattedValue, handleChange, handleBlur } = numberFormat({
    currencyFormat,
    fractionDigits,
  })

  const [_inputValue, _setInputValue] = useState(null)

  useEffect(() => {
    const value =
      typeof props.value === 'number'
        ? getFormattedValue(props.value)
        : props.value

    _setInputValue(value)
  }, [props.value, getFormattedValue])

  useEffect(function cleanUp() {
    return () => {
      _setInputValue(null)
    }
  }, [])

  const _handleChange = e => {
    if (!props.onChange) return

    if (typeof props.onChange !== 'function')
      throw new Error('The prop onChange must be a function')

    const rawValue = e?.target?.value || ''
    const { formattedValue } = handleChange(rawValue)

    props.onChange(formattedValue)
  }

  const _handleBlur = e => {
    const rawValue = e?.target?.value || ''
    const formattedValue = handleBlur(rawValue)

    typeof props.onChange === 'function' && props.onChange(formattedValue)
    typeof props.onBlur === 'function' && props.onBlur(formattedValue)
  }

  return (
    <Input
      prefix={showPrefix ? <div>{currencySymbol}</div> : null}
      suffix={showSuffix ? <div>{currencySymbol}</div> : null}
      {...props}
      type='text'
      value={_inputValue}
      onChange={_handleChange}
      onBlur={_handleBlur}
    />
  )
}

export default CurrencyInput
