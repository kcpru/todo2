import { test, expect, request } from '@playwright/test';

const API_BASE = process.env.PLAYWRIGHT_API_BASE || 'http://localhost:8080';

test.describe('Todo API', () => {
  test('create list, create task, patch task, delete task/list', async () => {
    const req = await request.newContext({ baseURL: API_BASE });

    const username = `e2e_todo_${Date.now()}`;
    const email = `${username}@example.com`;
    const password = 'Pass123!';

    // Register and obtain token
    let res = await req.post('/api/user/register', { data: { username, email, password } });
    expect(res.status()).toBe(200);
    const reg = await res.json();
    const token = reg?.accessToken || reg?.AccessToken || reg?.access_token;
    expect(token).toBeTruthy();
    const auth = { Authorization: `Bearer ${token}` };

    // Create list
    res = await req.post('/api/todo/lists', { headers: auth, data: { name: 'E2E List API' } });
    expect([200, 201]).toContain(res.status());
    const listJson = await res.json();
    const listId = listJson?.id || listJson?.Id || listJson?.Id;
    expect(listId).toBeTruthy();

    // Create task
    res = await req.post(`/api/todo/lists/${listId}/tasks`, {
      headers: auth,
      data: { title: 'Task API', description: 'desc' }
    });
    expect([200, 201]).toContain(res.status());
    const taskJson = await res.json();
    const taskId = taskJson?.id || taskJson?.Id;
    expect(taskId).toBeTruthy();

    // Patch task (mark completed)
    res = await req.patch(`/api/todo/tasks/${taskId}`, { headers: auth, data: { isCompleted: true } });
    expect(res.status()).toBe(200);

    // Get tasks and assert completed
    res = await req.get(`/api/todo/lists/${listId}/tasks`, { headers: auth });
    expect(res.status()).toBe(200);
    const tasks = await res.json();
    const found = tasks.find(t => t.id === taskId || t.Id === taskId);
    expect(found).toBeTruthy();
    const isCompleted = found?.isCompleted ?? found?.IsCompleted ?? found?.IsCompleted;
    expect(isCompleted).toBeTruthy();

    // Delete task
    res = await req.delete(`/api/todo/tasks/${taskId}`, { headers: auth });
    expect([200, 204]).toContain(res.status());

    // Delete list
    res = await req.delete(`/api/todo/lists/${listId}`, { headers: auth });
    expect([200, 204]).toContain(res.status());

    await req.dispose();
  });
});
