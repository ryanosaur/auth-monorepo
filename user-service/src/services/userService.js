// This is a simple in-memory service
// In a real application, this would interact with a database

const mockUsers = new Map()

export async function getUserProfile(userId, authPayload) {
  // Check if we have stored user data
  let user = mockUsers.get(userId)

  if (!user) {
    // Create a user profile from the Auth0 token data
    user = {
      id: userId,
      email: authPayload.email || `${userId}@example.com`,
      name: authPayload.name || 'User',
      picture: authPayload.picture || '',
      permissions: authPayload.permissions || [],
      scope: authPayload.scope || '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }

    // Store for future requests (in-memory for this example)
    mockUsers.set(userId, user)
  } else {
    // Update last login
    user.lastLogin = new Date().toISOString()
  }

  return {
    ...user,
    metadata: {
      totalLogins: mockUsers.has(userId) ? user.totalLogins + 1 : 1,
      source: 'user-service'
    }
  }
}

export async function getUserById(userId, authPayload) {
  return getUserProfile(userId, authPayload)
}

export async function updateUserProfile(userId, updates) {
  const user = mockUsers.get(userId)

  if (!user) {
    throw new Error('User not found')
  }

  const updatedUser = {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString()
  }

  mockUsers.set(userId, updatedUser)
  return updatedUser
}

// Add more user service methods as needed:
// - createUser
// - deleteUser
// - getUserPreferences
// - updateUserPreferences
// etc.
