import { useRef } from 'react'

export const useEditableList = ({
  state,
  setState,
  initRow,
  includeInitRow = true,
  minimumLength = 1,
  onAdd,
  onRemove,
  onChange,
  onBlur,
}) => {
  const rowModel = useRef()

  const handleAdd = () => {
    const newRow = rowModel.current || initRow

    setState(prevState => [...(prevState || []), newRow])

    if (typeof onAdd === 'function') onAdd()
  }

  if (!rowModel.current && includeInitRow) handleAdd()

  if (!rowModel.current) rowModel.current = initRow

  const handleRemove = rowIndex => {
    if (state.length === minimumLength) return

    setState(prevState => prevState.filter((_, index) => index !== rowIndex))

    if (typeof onRemove === 'function') onRemove(rowIndex)
  }

  const handleChange = (field, value, rowIndex) => {
    setState(prevState => {
      const newRow = { ...prevState[rowIndex], [field]: value }

      return prevState.map((row, index) => (index === rowIndex ? newRow : row))
    })

    if (typeof onChange === 'function') onChange(field, value, rowIndex)
  }

  const handleBlur = (field, value, rowIndex) => {
    if (typeof onBlur === 'function') onBlur(field, value, rowIndex)
  }

  return {
    handleAdd,
    handleRemove,
    handleChange,
    handleBlur,
    rowModel: rowModel.current,
  }
}
