import type { ReactNode } from 'react'
import { createContext, useState, useContext, useEffect } from 'react'

import { useEvents } from '../../hooks/useEvents'

export type FilterType = {
  fieldType: 'string' | 'number' | 'boolean'
  fieldName: string
  fieldValue: unknown
}

type FiltersContextType = {
  setFilters: (prefix: string, filters: FilterType[]) => void
  setData: (componentId:string, prefix: string, data: unknown[]) => void
  getFilteredData: (prefix: string, componentId: string) => unknown[]
  isWidgetFilteredByProps: (widgetData: unknown, prefix: string) => boolean
  clearFilters: (prefix: string) => void
}

type FilterMap = Record<string, FilterType[]>
type DataMap = Record<string, unknown[]>

type FilterEvent = {
  setFilters: { prefix: string; filters: FilterType[] }
  clearFilters: { prefix: string }
  setData: { componentId: string; prefix: string; data: unknown[] }
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined)

const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filterMap, setFilterMap] = useState<FilterMap>({})
  const [dataMap, setDataMap] = useState<DataMap>({})
  const { off, on } = useEvents<FilterEvent>()

  const setFilters = (prefix: string, filters: FilterType[]) => {
    setFilterMap((prev) => ({
      ...prev,
      [prefix]: filters,
    }))
  }

  const clearFilters = (prefix: string) => {
    setFilterMap((prev) => {
      const { [prefix]: _, ...rest } = prev
      return rest
    })
  }

  const setData = (componentId:string, prefix: string, data: unknown[]) => {
    setDataMap((prev) => ({
      ...prev,
      [prefix]: {
        ...(prev[prefix] || {}),
        [componentId]: data,
      },
    }))
  }

  useEffect(() => {
    on('setFilters', ({ filters, prefix }) => setFilters(prefix, filters))
    on('clearFilters', ({ prefix }) => clearFilters(prefix))
    on('setData', ({ componentId, data, prefix }) => setData(componentId, prefix, data))

    return () => {
      off('setFilters', ({ filters, prefix }) => setFilters(prefix, filters))
      off('clearFilters', ({ prefix }) => clearFilters(prefix))
      off('setData', ({ componentId, data, prefix }) => setData(componentId, prefix, data))
    }
  }, [off, on])

  // Helper type for data items with string keys
  type DataItem = Record<string, unknown>

  const matchesFilter = (itemValue: unknown, filter: FilterType): boolean => {
    const { fieldType, fieldValue } = filter

    switch (fieldType) {
      case 'string':
        return (itemValue as string).toLowerCase().includes((fieldValue as string).toLowerCase())
      case 'number':
      case 'boolean':
        return itemValue === fieldValue
        // case 'date':
        //   return new Date(itemValue as string).toISOString().split('T')[0] === new Date(fieldValue as string).toISOString().split('T')[0]

        // case 'date-range': {
        //   const date = new Date(itemValue as string).getTime()
        //   const from = (fieldValue as { from?: string }).from ? new Date((fieldValue as { from?: string }).from!).getTime() : -Infinity
        //   const to = (fieldValue as { to?: string }).to ? new Date((fieldValue as { to?: string }).to!).getTime() : Infinity
        //   return date >= from && date <= to
        // }

      default:
        return itemValue === fieldValue
    }
  }

  const getFilteredData = (prefix: string, componentId: string): unknown[] => {
    const filters: FilterType[] = (filterMap[prefix] as FilterType[] | undefined) ?? []
    const rawData: DataItem[] = (dataMap[prefix]?.[componentId] as DataItem[] | undefined) ?? []

    if (filters.length === 0) { return rawData }

    return rawData.filter((item: DataItem) =>
      filters.every((filter: FilterType) => {
        const itemValue = item[filter.fieldName]
        return matchesFilter(itemValue, filter)
      })
    )
  }

  const isWidgetFilteredByProps = (widgetData: unknown, prefix: string): boolean => {
    if (typeof widgetData !== 'object' || widgetData === null || !('prefix' in widgetData)) {
      return false
    }
    const dataObj = widgetData as Record<string, unknown>
    const filters: FilterType[] = (filterMap[prefix] as FilterType[] | undefined) ?? []

    if (filters.length === 0) { return false }

    for (const [key, value] of Object.entries(dataObj)) {
      const filter = filters.find(el => el.fieldName === key)
      if (filter) {
        if (!matchesFilter(value, filter)) {
          // The widget is filtered out by this filter
          return true
        }
      }
    }
    return false
  }

  return (
    <FiltersContext.Provider value={{ clearFilters, getFilteredData, isWidgetFilteredByProps, setData, setFilters }}>
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
      { fieldType: 'boolean-checkbox', fieldName: 'attivo', fieldValue: true },
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

const UserTable = () => {
  const { setData, getFilteredData } = useFilter();
  const prefix = 'utenti';
  const componentId = 'UserTable';

  useEffect(() => {
    setData(prefix, componentId, [
      { id: 1, nome: 'Alice', attivo: true, registratoIl: '2024-06-01' },
      { id: 2, nome: 'Bob', attivo: false, registratoIl: '2024-06-15' },
    ]);
  }, []);

  const utentiFiltrati = getFilteredData(prefix, componentId);

  return (
    <ul>
      {utentiFiltrati.map((u) => (
        <li key={u.id}>{u.nome}</li>
      ))}
    </ul>
  );
};
 */
