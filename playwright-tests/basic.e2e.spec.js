const { test, expect } = require('@playwright/test');

const baseUrl = process.env.BASE_URL || 'https://www.typescriptlang.org/';
console.log(`baseUrl: ${baseUrl}`);

test('Homepage loads', async ({ page }) => {

    // Go to https://www.typescriptlang.org/
    await page.goto(baseUrl);
    const title = await page.innerText('title');
    expect(title).toBe('TypeScript: Typed JavaScript at Any Scale.');
});

// test('test', async ({ page }) => {
//     // Go to https://www.typescriptlang.org/
//     await Promise.all([
//         page.waitForNavigation(/*{ url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html' }*/),
//         page.goto(baseUrl)
//     ]);
//     // Click text=Handbook
//     await Promise.all([
//         page.waitForNavigation(/*{ url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html' }*/),
//         page.click('text=Handbook')
//     ]);
//     // Click text=TypeScript for JavaScript Programmers
//     await Promise.all([
//         page.waitForNavigation(/*{ url: 'https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html' }*/),
//         page.click('text=TypeScript for JavaScript Programmers')
//     ]);
//     const title = await page.innerText('h2');
//     expect(title).toBe('TypeScript for JavaScript Programmers');
// });