import { useDebouncedCallback } from '@tanstack/react-pacer'
import { getRouteApi } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { BrowseLanguageCode, BrowseRegionCode, BrowseView } from '#/types/browse'
import { getDefaultLanguageForRegion } from '#/types/browse'

const browseRouteApi = getRouteApi('/_app/movies/')


const SEARCH_DEBOUNCE_MS = 400

export function useBrowseSearchInput() {
  const { q, view, region, language } = browseRouteApi.useSearch()
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
      search: (prev) => ({ ...prev, view: nextView, q: undefined }),
      replace: true,
    })
  }

  function onRegionChange(nextRegion: BrowseRegionCode) {
    void navigate({
      search: (prev) => ({
        ...prev,
        region: nextRegion,
        language: getDefaultLanguageForRegion(nextRegion),
      }),
      replace: true,
    })
  }

  function onLanguageChange(nextLanguage: BrowseLanguageCode) {
    void navigate({
      search: (prev) => ({ ...prev, language: nextLanguage }),
      replace: true,
    })
  }

  const isSearchPending = inputValue.trim() !== (q ?? '').trim()

  return {
    inputValue,
    onSearchChange,
    onViewChange,
    view,
    region,
    language,
    q,
    isSearchPending,
    onRegionChange,
    onLanguageChange,
  }
}
