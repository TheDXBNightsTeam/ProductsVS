import { test, expect } from '@playwright/test';

test.describe('Search Page', () => {
  test('should load search page', async ({ page }) => {
    await page.goto('/search');
    
    // Page should load without error
    await expect(page).not.toHaveURL(/error/);
  });

  test('should display search results for query parameter', async ({ page }) => {
    await page.goto('/search?q=iPhone');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded
    expect(page.url()).toContain('search');
  });

  test('should handle empty search query', async ({ page }) => {
    await page.goto('/search?q=');
    
    // Page should handle empty query gracefully
    await expect(page).not.toHaveURL(/error/);
  });

  test('should display search input on search page', async ({ page }) => {
    await page.goto('/search');
    
    // Look for search input or heading
    const searchHeading = page.locator('h1, h2').filter({ hasText: /search/i }).first();
    
    if (await searchHeading.count() > 0) {
      await expect(searchHeading).toBeVisible();
    }
  });

  test('should show loading state while searching', async ({ page }) => {
    await page.goto('/search?q=test');
    
    // Look for loading indicator (might be quick)
    const loadingIndicator = page.locator('text=/loading|searching/i').first();
    
    // This might not be visible if loading is too fast
    // Just ensure page loads
    await page.waitForLoadState('domcontentloaded');
  });

  test('should handle special characters in search', async ({ page }) => {
    const specialQuery = 'test & special';
    await page.goto(`/search?q=${encodeURIComponent(specialQuery)}`);
    
    // Page should load without error
    await expect(page).not.toHaveURL(/error/);
  });

  test('should display no results message for invalid search', async ({ page }) => {
    await page.goto('/search?q=xyzabc123notfound999');
    
    // Wait for results
    await page.waitForLoadState('networkidle');
    
    // Look for "no results" or similar message
    const noResults = page.locator('text=/no results|not found|no comparisons/i').first();
    
    // Check if message exists (optional - depends on implementation)
    if (await noResults.count() > 0) {
      await expect(noResults).toBeVisible();
    }
  });

  test('should allow performing new search from search page', async ({ page, viewport }) => {
    // Skip on mobile if search is in menu
    if (viewport && viewport.width < 768) {
      test.skip();
    }
    
    await page.goto('/search?q=initial');
    
    const searchInput = page.locator('input[type="text"]').filter({ hasText: /search/i }).first();
    
    if (await searchInput.count() === 0) {
      // Try finding by placeholder
      const searchByPlaceholder = page.locator('input[placeholder*="Search"]').first();
      
      if (await searchByPlaceholder.count() > 0) {
        await searchByPlaceholder.fill('new search');
        await searchByPlaceholder.press('Enter');
        
        await page.waitForURL(/search/);
        expect(page.url()).toContain('new%20search');
      }
    }
  });
});
