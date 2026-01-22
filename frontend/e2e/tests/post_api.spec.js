import { test, expect, request } from '@playwright/test';

const API_BASE = process.env.PLAYWRIGHT_API_BASE || 'http://localhost:8080';

test.describe('Post API', () => {
  test('create post and comment and like', async () => {
    const req = await request.newContext({ baseURL: API_BASE });

    const username = `e2e_post_${Date.now()}`;
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
    res = await req.post('/api/todo/lists', { headers: auth, data: { name: 'Post List' } });
    expect([200,201]).toContain(res.status());
    const listJson = await res.json();
    const listId = listJson?.id || listJson?.Id;
    expect(listId).toBeTruthy();

    // Create a post from the list
    res = await req.post('/api/post', { headers: auth, data: { todoListId: listId, content: 'E2E post' } });
    expect(res.status()).toBe(200);
    const postJson = await res.json();
    const postId = postJson?.id || postJson?.Id || (postJson?.post?.id);
    expect(postId).toBeTruthy();

    // Add comment
    res = await req.post(`/api/post/${postId}/comments`, { headers: auth, data: { commentText: 'Nice!' } });
    expect(res.status()).toBe(200);
    const comment = await res.json();
    expect(comment?.postId || comment?.PostId).toBeTruthy();
    const commentId = comment?.id || comment?.Id;

    // Like post
    res = await req.post(`/api/post/${postId}/likes`, { headers: auth, data: { likesCount: 5 } });
    expect(res.status()).toBe(200);
    const likeResp = await res.json();
    expect(likeResp?.likesCount || likeResp?.likescount || likeResp?.likes_count).toBeTruthy();

    // Like comment
    if (commentId) {
      res = await req.post(`/api/post/comments/${commentId}/likes`, { headers: auth, data: { likesCount: 2 } });
      // some APIs use different path; try alternate if 404
      if (res.status() === 404) {
        res = await req.post(`/api/post/${postId}/comments/${commentId}/likes`, { headers: auth, data: { likesCount: 2 } });
      }
      expect([200, 201]).toContain(res.status());
    }

    await req.dispose();
  });
});
