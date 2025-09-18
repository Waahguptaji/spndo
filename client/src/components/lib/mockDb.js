// src/components/lib/mockDb.js

// Use global object to persist across requests (in dev & serverless runtime)
if (!globalThis.mockUsers) {
  globalThis.mockUsers = [];
}
const mockUsers = globalThis.mockUsers;

export const addUser = (email, password) => {
  if (mockUsers.some(user => user.email === email)) {
    return null;
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password, // ⚠️ not hashed (only for demo!)
  };
  mockUsers.push(newUser);
  console.log("Current mock users:", mockUsers);
  console.log("newuser", newUser);
  return newUser;
};
export const findUserByEmail = (email) => {
  return mockUsers.find(user => user.email === email);
};

export const findUserById = (id) => {
  return mockUsers.find(user => user.id === id);
};
