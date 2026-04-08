const { v4: uuidv4 } = require('uuid');

const users = [];

class User {
  constructor({ name, email, role }) {
    this.id = uuidv4();
    this.name = name;
    this.email = email;
    this.role = role || 'member';
    this.createdAt = new Date().toISOString();
  }

  static getAll() {
    return users;
  }

  static getById(id) {
    return users.find(u => u.id === id);
  }

  static getByEmail(email) {
    return users.find(u => u.email === email);
  }

  static create(data) {
    const user = new User(data);
    users.push(user);
    return user;
  }

  static delete(id) {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  }

  static clearAll() {
    users.length = 0;
  }
}

module.exports = User;
