//empty array
const users = [];
//add id name and profile
const addUser = ({ id, name, profile }) => {
  const user = { id, name, profile };

  users.push(user);

  return { user };
};

//removes the user
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};
//gets the user
const getUser = (id) => users.find((user) => user.name === id);

//exports the functions
module.exports = {
  addUser,
  removeUser,
  getUser,
};
