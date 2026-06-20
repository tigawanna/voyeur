import { useDebouncedCallback } from '@tanstack/react-pacer'
import { getRouteApi } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { BrowseView } from '#/types/browse'

const browseRouteApi = getRouteApi('/_app/browse/')

const SEARCH_DEBOUNCE_MS = 400

export function useBrowseSearchInput() {
  const { q, view } = browseRouteApi.useSearch()
  const navigate = browseRouteApi.useNavigate()
  const [inputValue, setInputValue] = useState(q ?? '')

  useEffect(() => {
    setInputValue(q ?? '')
  }, [q])

  const commitSearch = useDebouncedCallback((value: string) => {
    const trimmed = value.trim()
    void navigate({
      search: (prev) => ({
        ...prev,
        q: trimmed.length > 0 ? trimmed : undefined,
      }),
      replace: true,
    })
  }, { wait: SEARCH_DEBOUNCE_MS })

  function onSearchChange(value: string) {
    setInputValue(value)
    commitSearch(value)
  }

  function onViewChange(nextView: BrowseView) {
    setInputValue('')
    void navigate({
      search: { view: nextView, q: undefined },
      replace: true,
    })
  }

  const isSearchPending = inputValue.trim() !== (q ?? '').trim()

  return {
    inputValue,
    onSearchChange,
    onViewChange,
    view,
    q,
    isSearchPending,
  }
}
