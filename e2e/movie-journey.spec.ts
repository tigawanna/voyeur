import { expect, test } from '@playwright/test'
import { installTmdbMocks } from './msw-routes'

const BROWSE_MOVIE_ID = 646097
const RECOMMENDED_MOVIE_ID = 11028

test.describe('movie browsing journey', () => {
  test.beforeEach(async ({ page }) => {
    await installTmdbMocks(page)
    await page.goto('/movies')
  })

  test('browse, detail, recommendations, library, and saved lists', async ({ page }) => {
    const browseGrid = page.getByTestId('movies-browse-grid')
    await expect(browseGrid).toBeVisible()

    const browseCard = page.getByTestId(`movie-card-${BROWSE_MOVIE_ID}`)
    await expect(browseCard).toBeVisible()
    await expect(browseCard).toContainText('Reel Hero')

    await browseCard.click()

    await expect(page).toHaveURL(new RegExp(`/movies/movie/${BROWSE_MOVIE_ID}$`))
    await expect(page.getByTestId('movie-detail')).toBeVisible()
    await expect(page.getByTestId('movie-detail-title')).toHaveText('Reel Hero')
    await expect(page.getByTestId('movie-detail-metadata')).toBeVisible()
    await expect(page.getByTestId('movie-detail-metadata')).toContainText('2h 8m')
    await expect(page.getByTestId('movie-detail-metadata')).toContainText('Drama')

    const recommendations = page.getByTestId('movie-recommendations')
    await expect(recommendations).toBeVisible()
    const recommendationCard = recommendations.getByTestId(`movie-card-${RECOMMENDED_MOVIE_ID}`)
    await expect(recommendationCard).toBeVisible()
    await expect(recommendationCard).toContainText('Recommended Pick')

    const detail = page.getByTestId('movie-detail')
    await detail.getByTestId('add-favorite-button').click()
    await detail.getByTestId('add-watchlist-button').click()

    await recommendationCard.click()

    await expect(page).toHaveURL(new RegExp(`/movies/movie/${RECOMMENDED_MOVIE_ID}$`))
    await expect(page.getByTestId('movie-detail-title')).toHaveText('Recommended Pick')
    await expect(page.getByTestId('movie-detail-metadata')).toBeVisible()
    await expect(page.getByTestId('movie-recommendations')).toBeVisible()

    await page.getByTestId('nav-favorites').click()
    await expect(page).toHaveURL('/favorites')
    const favoritesGrid = page.getByTestId('favorites-grid')
    await expect(favoritesGrid).toBeVisible()
    const favoriteCard = page.getByTestId(`saved-movie-card-${BROWSE_MOVIE_ID}`)
    await expect(favoriteCard).toBeVisible()
    await expect(favoriteCard).toContainText('Reel Hero')

    await page.getByTestId('nav-watchlist').click()
    await expect(page).toHaveURL('/watchlist')
    const watchlistGrid = page.getByTestId('watchlist-grid')
    await expect(watchlistGrid).toBeVisible()
    const watchlistCard = page.getByTestId(`saved-movie-card-${BROWSE_MOVIE_ID}`)
    await expect(watchlistCard).toBeVisible()
    await expect(watchlistCard).toContainText('Reel Hero')
  })
})
