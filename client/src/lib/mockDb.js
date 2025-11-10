// // src/components/lib/mockDb.js

// if (!globalThis.mockUsers) {
//   globalThis.mockUsers = [];
// }
// const mockUsers = globalThis.mockUsers;

// export const addUser = (email, password) => {
//   if (mockUsers.some((user) => user.email === email)) {
//     return null;
//   }

//   const newUser = {
//     id: Date.now().toString(),
//     email,
//     password,
//     name: "",
//     phone: "",
//     address: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     image: "", // ✅ added image persistence

//   };
//   mockUsers.push(newUser);
//   return newUser;
// };

// export const findUserByEmail = (email) => {
//   return mockUsers.find((user) => user.email === email);
// };

// export const findUserById = (id) => {
//   return mockUsers.find((user) => user.id === id);
// };

// export const updateUser = (id, updates) => {
//   const user = findUserById(id);
//   if (!user) return null;

//   Object.assign(user, updates); // ✅ merge updates into user
//   return user;
// };
// export function updatePassword(id, currentPassword, newPassword) {
//   const user = mockUsers.find((u) => u.id === id);
//   if (!user) return null;
//   if (user.password !== currentPassword) return "wrong-password"; // check current
//   user.password = newPassword;
//   return user;
// }
// console.log("Mock DB initialized with users:", mockUsers);
