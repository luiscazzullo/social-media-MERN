export const create = async (user) => {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export const list = async (signal) => {
  try {
    const response = await fetch('/api/users', {
      method: 'GET',
      signal: signal
    })
    return await response.json();
  } catch (error) {
    console.log(error)
  }
}

export const read = async (params, credentials, signal) => {
  try {
    const response = await fetch(`/api/users/${params.userId}`, {
      method: 'GET',
      signal: signal,
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

export const update = async (params, credentials, user) => {
  try {
    const response = await fetch(`/api/users/${params.userId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      },
      body: user
    })
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export const remove = async (params, credentials) => {
  try {
    const response = await fetch(`/api/users/${params.userId}`, {
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

export const follow = async (params, credentials, followId) => {
  try {
    const response = await fetch('/api/users/follow', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      },
      body: JSON.stringify({ userId: params.userId, followId })
    })
    return await response.json();
  } catch (error) {
    console.log(error)
  }
}

export const unfollow = async (params, credentials, unfollowId) => {
  try {
    const response = await fetch('/api/users/unfollow', {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.t}`
      },
      body: JSON.stringify({ userId: params.userId, unfollowId })
    })
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export const findPeople = async (params, credentials, signal) => {
  try {
    const response = await fetch(`/api/users/findpeople/${params.userId}`, {
      method: 'GET',
      signal: signal,
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
