import { test, expect, request } from '@playwright/test';

const API_BASE = process.env.PLAYWRIGHT_API_BASE || 'http://localhost:8080';

test.describe('Auth API', () => {
  test('register -> login -> me returns correct data', async () => {
    const req = await request.newContext({ baseURL: API_BASE });

    const username = `e2e_auth_${Date.now()}`;
    const email = `${username}@example.com`;
    const password = 'Pass123!';

    // Register
    let res = await req.post('/api/user/register', {
      data: { username, email, password }
    });
    expect(res.status()).toBe(200);
    const reg = await res.json();
    const token = reg?.accessToken || reg?.AccessToken || reg?.access_token;
    expect(token).toBeTruthy();

    // Login (by username)
    res = await req.post('/api/user/login', { data: { usernameOrEmail: username, password } });
    expect(res.status()).toBe(200);
    const loginJson = await res.json();
    const token2 = loginJson?.accessToken || loginJson?.AccessToken || loginJson?.access_token;
    expect(token2).toBeTruthy();

    // Me
    res = await req.get('/api/user/me', { headers: { Authorization: `Bearer ${token2}` } });
    expect(res.status()).toBe(200);
    const me = await res.json();
    expect(me).toHaveProperty('username');
    expect(me.username.toLowerCase()).toBe(username.toLowerCase());
    expect(me.email.toLowerCase()).toBe(email.toLowerCase());

    await req.dispose();
  });
});
