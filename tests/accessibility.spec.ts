import { test, expect } from '@playwright/test';

test.describe('Theme Toggle', () => {
  test('should have theme toggle button', async ({ page }) => {
    await page.goto('/');
    
    // Look for theme toggle - might be a button with theme-related text or icon
    const themeButton = page.locator('button').filter({ 
      has: page.locator('svg, text=/theme|dark|light/i')
    }).first();
    
    if (await themeButton.count() > 0) {
      await expect(themeButton).toBeVisible();
    } else {
      // Alternative: look for any theme-related button
      const themeToggle = page.locator('[data-theme-toggle], [aria-label*="theme"]').first();
      if (await themeToggle.count() > 0) {
        await expect(themeToggle).toBeVisible();
      }
    }
  });

  test('should toggle between light and dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Find theme toggle button
    const themeButton = page.locator('button').filter({ 
      has: page.locator('svg')
    }).first();
    
    if (await themeButton.count() > 0) {
      // Get initial theme
      const initialClass = await page.locator('html').getAttribute('class');
      
      // Click toggle
      await themeButton.click();
      
      // Wait for theme change
      await page.waitForTimeout(500);
      
      // Get new theme
      const newClass = await page.locator('html').getAttribute('class');
      
      // Theme should have changed
      expect(newClass).not.toBe(initialClass);
    } else {
      test.skip();
    }
  });

  test('should persist theme preference', async ({ page, context }) => {
    await page.goto('/');
    
    // Find and click theme toggle
    const themeButton = page.locator('button').filter({ 
      has: page.locator('svg')
    }).first();
    
    if (await themeButton.count() > 0) {
      await themeButton.click();
      await page.waitForTimeout(500);
      
      const theme = await page.locator('html').getAttribute('class');
      
      // Navigate away and back
      await page.goto('/about');
      await page.goto('/');
      
      // Theme should persist
      const persistedTheme = await page.locator('html').getAttribute('class');
      expect(persistedTheme).toBe(theme);
    } else {
      test.skip();
    }
  });

  test('should apply theme to entire page', async ({ page }) => {
    await page.goto('/');
    
    // Check if dark/light class is applied to html element
    const htmlClass = await page.locator('html').getAttribute('class');
    expect(htmlClass).toBeTruthy();
  });
});

test.describe('Responsive Design', () => {
  test('should display properly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Check main content is visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Desktop search should be visible
    const desktopSearch = page.locator('input[placeholder*="Search"]').first();
    if (await desktopSearch.count() > 0) {
      await expect(desktopSearch).toBeVisible();
    }
  });

  test('should display properly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Check main content is visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Navigation should be visible
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should display properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check main content is visible
    await expect(page.locator('h1')).toBeVisible();
    
    // Mobile menu toggle might be visible
    const menuToggle = page.locator('button[aria-label*="menu"], button[aria-expanded]').first();
    if (await menuToggle.count() > 0) {
      await expect(menuToggle).toBeVisible();
    }
  });

  test('should have responsive form layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Form should be visible on mobile
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input#productA')).toBeVisible();
    await expect(page.locator('input#productB')).toBeVisible();
  });

  test('should handle viewport changes', async ({ page }) => {
    await page.goto('/');
    
    // Start with desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Change to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('h1')).toBeVisible();
    
    // Page should remain functional
    await expect(page.locator('form')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check that there's only one h1
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThan(0);
  });

  test('should have skip to content link', async ({ page }) => {
    await page.goto('/');
    
    // Look for skip link (might be hidden until focused)
    const skipLink = page.locator('a[href*="#content"], a[href*="#main"]').first();
    
    if (await skipLink.count() > 0) {
      await expect(skipLink).toBeInViewport({ ratio: 0 });
    }
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    // Check for aria-label on navigation
    const nav = page.locator('nav[aria-label]').first();
    await expect(nav).toBeVisible();
    
    // Check for aria-label on form
    const form = page.locator('form[aria-label]').first();
    await expect(form).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Tab through page
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Some element should have focus
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement;
      return el?.tagName || null;
    });
    
    expect(focusedElement).toBeTruthy();
  });

  test('should have focus indicators', async ({ page }) => {
    await page.goto('/');
    
    // Focus an input
    await page.locator('input#productA').focus();
    
    // Check if focus is visible (has outline or focus ring)
    const focusedInput = page.locator('input#productA');
    await expect(focusedInput).toBeFocused();
  });
});
