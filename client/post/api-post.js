export const listNewsFeed = async (params, credentials, signal) => {
  try {
    const response = await fetch(`/api/posts/feed/${params.userId}`, {
      method: 'GET',
      signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      }
    })
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export const listByUser = async (params, credentials) => {
  try {
    console.log('Los parámetros ===>', params);
    const response = await fetch(`/api/posts/by/${params.userId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      }
    })
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export const create = async (params, credentials, post) => {
  try {
    const response = await fetch(`/api/posts/new/${params.userId}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      },
      body: post
    })
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export const remove = async (params, credentials) => {
  try {
    const response = await fetch(`/api/posts/${params.postId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      }
    })
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export const like = async (params, credentials, postId) => {
  try {
    const response = await fetch('/api/posts/like', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      },
      body: JSON.stringify({ userId: params.userId, postId })
    })
    return await response.json()
  } catch (error) {
    console.log(error);
  }
}

export const unlike = async (params, credentials, postId) => {
  try {
    const response = await fetch('/api/posts/unlike', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      },
      body: JSON.stringify({ userId: params.userId, postId })
    })
    return await response.json()
  } catch (error) {
    console.log(error);
  }
}

export const comment = async (params, credentials, postId, comment) => {
  try {
    const response = await fetch('/api/posts/comment', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      },
      body: JSON.stringify({ userId: params.userId, postId, comment})
    })
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export const uncomment = async (params, credentials, postId, comment) => {
  try {
    const response = await fetch('/api/posts/comments', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      },
      body: JSON.stringify({ userId: params.userId, postId, comment })
    })
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}