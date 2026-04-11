import { test, expect } from '@playwright/test';

test.use({
  storageState: 'playwright/.auth/user.json'
});

test('Unit Test: Image Validation Logic', async ({ page }) => {
  await page.goto('http://localhost:5173/marketplace');
  await page.getByRole('button', { name: 'List an Item' }).click();
  await page.getByRole('button', { name: 'New Listing' }).click();
  
  await page.getByRole('textbox', { name: 'e.g. Used Bicycle in Good' }).fill('phone');
  

  await page.getByRole('button', { name: 'List Item' }).click();

 // Assert that the validation message is displayed
  await expect(page.getByText('Please select an image.')).toBeVisible();
});