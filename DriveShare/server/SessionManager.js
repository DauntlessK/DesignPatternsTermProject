class SessionManager {
  constructor() {
    if (SessionManager.instance) {
      return SessionManager.instance;
    }

    this.currentUser = null;
    SessionManager.instance = this;
  }

  login(user) {
    this.currentUser = user;
  }

  logout() {
    this.currentUser = null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }
}

module.exports = new SessionManager();