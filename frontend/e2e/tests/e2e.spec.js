import { test, expect, request } from '@playwright/test';

// High-level E2E smoke test that uses backend HTTP API for core flows
// This complements unit tests by exercising the full stack (DB + API)

const API_BASE = process.env.PLAYWRIGHT_API_BASE || 'http://localhost:8080';

test.describe('E2E smoke', () => {
  test('frontend loads and basic API flows (register, login, list/task, post/comment)', async ({ page }) => {
    // UI smoke: page loads
    await page.goto('/');
    await expect(page).toHaveTitle(/frontend/i);

    // Use Playwright's APIRequest to exercise backend endpoints
    const req = await request.newContext({ baseURL: API_BASE });

    const username = `e2e_user_${Date.now()}`;
    const email = `${username}@example.com`;
    const password = 'Pass123!';

    // Register
    let res = await req.post('/api/user/register', {
      data: { username, email, password }
    });
    expect(res.status()).toBe(200);
    const registerJson = await res.json();
    const token = registerJson?.accessToken || registerJson?.AccessToken || registerJson?.access_token;
    expect(token).toBeTruthy();

    const authHeader = { Authorization: `Bearer ${token}` };

    // Create list
    res = await req.post('/api/todo/lists', {
      headers: authHeader,
      data: { name: 'E2E List' }
    });
    expect([200,201]).toContain(res.status());
    const listJson = await res.json();
    const listId = listJson?.id || listJson?.Id;
    expect(listId).toBeTruthy();

    // Create task in list
    res = await req.post(`/api/todo/lists/${listId}/tasks`, {
      headers: authHeader,
      data: { title: 'E2E Task', description: 'created by e2e' }
    });
    expect([200,201]).toContain(res.status());
    const taskJson = await res.json();
    const taskId = taskJson?.id || taskJson?.Id;
    expect(taskId).toBeTruthy();

    // Patch task to mark completed
    res = await req.patch(`/api/todo/tasks/${taskId}`, {
      headers: authHeader,
      data: { isCompleted: true }
    });
    expect(res.status()).toBe(200);

    // Create post from the list
    res = await req.post('/api/post', {
      headers: authHeader,
      data: { todoListId: listId, content: 'E2E post content' }
    });
    expect(res.status()).toBe(200);
    const postJson = await res.json();
    const postId = postJson?.id || postJson?.Id || (postJson?.post?.id);
    expect(postId).toBeTruthy();

    // Add comment
    res = await req.post(`/api/post/${postId}/comments`, {
      headers: authHeader,
      data: { commentText: 'Nice e2e comment' }
    });
    expect(res.status()).toBe(200);
    const commentJson = await res.json();
    expect(commentJson?.postId || commentJson?.PostId).toBeTruthy();

    await req.dispose();
  });
});
