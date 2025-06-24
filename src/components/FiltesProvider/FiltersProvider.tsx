import dayjs from 'dayjs'
import type { ReactNode } from 'react'
import { createContext, useState, useContext, useEffect } from 'react'

import { useEvents } from '../../hooks/useEvents'

export type FilterType = {
  fieldType: 'string' | 'number' | 'boolean' | 'date' | 'daterange'
  fieldName: string[]
  fieldValue: unknown
}

type DataItem = Record<string, unknown>

type FiltersContextType = {
  setFilters: (prefix: string, filters: FilterType[]) => void
  getFilteredData: (data: DataItem[], prefix: string) => unknown[]
  isWidgetFilteredByProps: (widgetData: unknown, prefix: string) => boolean
  clearFilters: (prefix: string) => void
  getFilters: (prefix: string) => FilterType[]
}

type FilterMap = Record<string, FilterType[]>

type FilterEvent = {
  setFilters: { prefix: string; filters: FilterType[] }
  clearFilters: { prefix: string }
  setData: { componentId: string; prefix: string; data: unknown[] }
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filterMap, setFilterMap] = useState<FilterMap>({})
  const { off, on } = useEvents<FilterEvent>()

  const setFilters = (prefix: string, filters: FilterType[]) => {
    setFilterMap((prev) => ({
      ...prev,
      [prefix]: filters.filter(el => el.fieldValue !== undefined),
    }))
  }

  const getFilters = (prefix: string) => filterMap[prefix]

  const clearFilters = (prefix: string) => {
    setFilterMap((prev) => {
      const { [prefix]: _, ...rest } = prev
      return rest
    })
  }

  useEffect(() => {
    on('setFilters', ({ filters, prefix }) => setFilters(prefix, filters))
    on('clearFilters', ({ prefix }) => clearFilters(prefix))

    return () => {
      off('setFilters', ({ filters, prefix }) => setFilters(prefix, filters))
      off('clearFilters', ({ prefix }) => clearFilters(prefix))
    }
  }, [off, on])

  const matchesFilter = (itemValue: unknown, filter: FilterType): boolean => {
    const { fieldType, fieldValue } = filter

    switch (fieldType) {
      case 'string':
        if (Array.isArray(itemValue)) {
          return itemValue.filter((val: string) => val.toLowerCase().includes((fieldValue as string).toLowerCase())).length > 0
        }
        return (itemValue as string).toLowerCase().includes((fieldValue as string).toLowerCase())

      case 'number':
      case 'boolean':
        return itemValue === fieldValue

      case 'date':
        if (typeof itemValue === 'string' && dayjs.isDayjs(fieldValue)) {
          return dayjs(itemValue).startOf('day').isSame(fieldValue.startOf('day'), 'day')
        }
        return true

      case 'daterange': {
        if (typeof itemValue === 'string' && Array.isArray(fieldValue) && dayjs.isDayjs(fieldValue[0]) && dayjs.isDayjs(fieldValue[1])) {
          const date = dayjs(itemValue).startOf('day')

          const fromValid = fieldValue[0] ? date.isSame(fieldValue[0].startOf('day')) || date.isAfter(fieldValue[0].startOf('day')) : true
          const toValid = fieldValue[1] ? date.isSame(fieldValue[1].startOf('day')) || date.isBefore(fieldValue[1].startOf('day')) : true

          return fromValid && toValid
        }
        return true
      }

      default:
        return itemValue === fieldValue
    }
  }

  const getFilteredData = (data: DataItem[], prefix: string): unknown[] => {
    const filters: FilterType[] = (filterMap[prefix] as FilterType[] | undefined) ?? []

    if (filters.length === 0) { return data }

    return data.filter((item: DataItem) =>
      filters.every((filter: FilterType) => (
        filter.fieldName.map((fieldName) => {
          const itemValue = item[fieldName]
          return matchesFilter(itemValue, filter)
        })
      ))
    )
  }

  const isWidgetFilteredByProps = (widgetData: unknown, prefix: string): boolean => {
    if (typeof widgetData !== 'object' || widgetData === null || ('prefix' in widgetData)) {
      return false
    }
    const dataObj = widgetData as Record<string, unknown>
    const filters: FilterType[] = (filterMap[prefix] as FilterType[] | undefined) ?? []

    if (filters.length === 0) { return false }

    // for (const [key, value] of Object.entries(dataObj)) {
    //   const filter = filters.find(el => el.fieldName === key)
    //   if (filter) {
    //     if (!matchesFilter(value, filter)) {
    //       // The widget is filtered out by this filter
    //       return true
    //     }
    //   }
    // }

    for (const filter of filters) {
      const allFieldsFail = filter.fieldName.every(fieldName => {
        const value = dataObj[fieldName]
        return value === undefined || !matchesFilter(value, filter)
      })

      if (allFieldsFail) {
        // None of the specified properties match the filter → The widget is filtered out by this filter
        return true
      }
    }

    return false
  }

  return (
    <FiltersContext.Provider value={{ clearFilters, getFilteredData, getFilters, isWidgetFilteredByProps, setFilters }}>
      {children}
    </FiltersContext.Provider>
  )
}

export default FiltersProvider

export const useFilter = () => {
  const context = useContext(FiltersContext)
  if (!context) {
    throw new Error('user useFilter into FiltersProvider')
  }
  return context
}

/**
 * How to apply filters:

import { useFilter } from '../context/FilterContext';

const FilterForm = () => {
  const { setFilters } = useFilter();
  const prefix = 'utenti';

  const applyFilter = () => {
    setFilters(prefix, [
      { fieldType: 'boolean', fieldName: 'attivo', fieldValue: true },
      { fieldType: 'date-range', fieldName: 'registratoIl', fieldValue: { from: '2024-06-01', to: '2024-06-30' } }
    ]);
  };

  return <button onClick={applyFilter}>Applica filtri</button>;
};

 */

/**
 * How to get filtered data:
 *
import { useFilter } from '../context/FilterContext';

const UserTable = ({data}) => {
  const { getFilteredData } = useFilter();
  const prefix = 'utenti';

  const utentiFiltrati = getFilteredData(data, prefix);

  return (
    <ul>
      {utentiFiltrati.map((u) => (
        <li key={u.id}>{u.nome}</li>
      ))}
    </ul>
  );
};
 */
