let auth = (() => {
    function isAuthed() {
        return sessionStorage.getItem('authtoken') !== null;
    }

    function saveSession(data) {
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('id', data._id);
        sessionStorage.setItem('authtoken', data._kmd.authtoken);
        sessionStorage.setItem('userStatus', data.userRole);
    }

    function login(username, password) {
        return requester.post('user', 'login', {username, password}, 'basic');
    }

    function register(username, password) {
        let points = 10;
        return requester.post('user', '', {username, password, points}, 'basic');
    }

    function logout() {
        return requester.post('user', '_logout', {authtoken: sessionStorage.getItem('authtoken')});
    }

    return {
        saveSession,
        login,
        register,
        logout,
        isAuthed
    }
})();