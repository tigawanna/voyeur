import { z } from 'zod'
import { defaultMovieSortBy, MOVIE_SORT_BY_VALUES } from '#/types/movie-sort'

export const BROWSE_VIEWS = ['popular', 'trending', 'recent'] as const

export type BrowseView = (typeof BROWSE_VIEWS)[number]

export const BROWSE_REGIONS = [
  { code: 'global', label: 'Worldwide' },
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'ES', label: 'Spain' },
  { code: 'IT', label: 'Italy' },
  { code: 'NL', label: 'Netherlands' },
  { code: 'SE', label: 'Sweden' },
  { code: 'NO', label: 'Norway' },
  { code: 'DK', label: 'Denmark' },
  { code: 'IE', label: 'Ireland' },
  { code: 'NZ', label: 'New Zealand' },
  { code: 'JP', label: 'Japan' },
  { code: 'BR', label: 'Brazil' },
  { code: 'MX', label: 'Mexico' },
  { code: 'IN', label: 'India' },
] as const

export type BrowseRegionCode = (typeof BROWSE_REGIONS)[number]['code']

export const BROWSE_LANGUAGES = [
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'en-CA', label: 'English (Canada)' },
  { code: 'en-AU', label: 'English (Australia)' },
  { code: 'en-IE', label: 'English (Ireland)' },
  { code: 'en-NZ', label: 'English (New Zealand)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'fr-FR', label: 'French (France)' },
  { code: 'fr-CA', label: 'French (Canada)' },
  { code: 'de-DE', label: 'German' },
  { code: 'es-ES', label: 'Spanish (Spain)' },
  { code: 'es-MX', label: 'Spanish (Mexico)' },
  { code: 'it-IT', label: 'Italian' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)' },
  { code: 'nl-NL', label: 'Dutch' },
  { code: 'sv-SE', label: 'Swedish' },
  { code: 'nb-NO', label: 'Norwegian' },
  { code: 'da-DK', label: 'Danish' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'ko-KR', label: 'Korean' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
] as const

export type BrowseLanguageCode = (typeof BROWSE_LANGUAGES)[number]['code']

const browseRegionCodes = BROWSE_REGIONS.map((region) => region.code) as [
  BrowseRegionCode,
  ...BrowseRegionCode[],
]

const browseLanguageCodes = BROWSE_LANGUAGES.map((language) => language.code) as [
  BrowseLanguageCode,
  ...BrowseLanguageCode[],
]

export const REGION_DEFAULT_LANGUAGES = {
  global: 'en-US',
  US: 'en-US',
  GB: 'en-GB',
  CA: 'en-CA',
  AU: 'en-AU',
  DE: 'de-DE',
  FR: 'fr-FR',
  ES: 'es-ES',
  IT: 'it-IT',
  NL: 'nl-NL',
  SE: 'sv-SE',
  NO: 'nb-NO',
  DK: 'da-DK',
  IE: 'en-IE',
  NZ: 'en-NZ',
  JP: 'ja-JP',
  BR: 'pt-BR',
  MX: 'es-MX',
  IN: 'en-IN',
} as const satisfies Record<BrowseRegionCode, BrowseLanguageCode>

export const browseSearchSchema = z
  .object({
    view: z.enum(BROWSE_VIEWS).catch('popular'),
    q: z.string().optional().catch(undefined),
    region: z.enum(browseRegionCodes).catch('global'),
    language: z.enum(browseLanguageCodes).optional().catch(undefined),
    sortBy: z.enum(MOVIE_SORT_BY_VALUES).catch(defaultMovieSortBy),
  })
  .transform((search) => ({
    ...search,
    language: search.language ?? getDefaultLanguageForRegion(search.region),
  }))

export type BrowseSearch = z.infer<typeof browseSearchSchema>

export const browseSearchDefaults: BrowseSearch = {
  view: 'popular',
  region: 'global',
  language: 'en-US',
  sortBy: defaultMovieSortBy,
}

export function getDefaultLanguageForRegion(region: BrowseRegionCode): BrowseLanguageCode {
  return REGION_DEFAULT_LANGUAGES[region]
}

export function isGlobalBrowseRegion(region: BrowseRegionCode) {
  return region === 'global'
}

export function getBrowseRegionLabel(region: BrowseRegionCode) {
  return BROWSE_REGIONS.find((item) => item.code === region)?.label ?? region
}

export function getBrowseLanguageLabel(language: BrowseLanguageCode) {
  return BROWSE_LANGUAGES.find((item) => item.code === language)?.label ?? language
}

export const BROWSE_VIEW_LABELS: Record<BrowseView, string> = {
  popular: 'Popular',
  trending: 'Trending',
  recent: 'Now playing',
}

export function getBrowseHeading(view: BrowseView, q?: string) {
  const trimmed = q?.trim()
  if (trimmed) return `Results for "${trimmed}"`

  switch (view) {
    case 'trending':
      return 'Trending today'
    case 'recent':
      return 'Now in theaters'
    default:
      return 'Popular right now'
  }
}
