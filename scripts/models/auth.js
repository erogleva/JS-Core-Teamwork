let auth = (() => {
    function isAuthed() {
        return sessionStorage.getItem('authtoken') !== null;
    }

    function saveSession(data) {
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('id', data._id);
        sessionStorage.setItem('authtoken', data._kmd.authtoken);
        sessionStorage.setItem('userStatus', data.userRole);
        sessionStorage.setItem('avatar', data.avatar);
    }

    function login(username, password) {
        return requester.post('user', 'login', {username, password}, 'basic');
    }

    function register(username, password, avatar, email, phone, fName, lName) {
        let points = 10;
        return requester.post('user', '', {username, password, avatar, email, phone, fName, lName, points}, 'basic');
    }

    function logout() {
        return requester.post('user', '_logout', {authtoken: sessionStorage.getItem('authtoken')});
    }

    function userInfo() {
        let endpoint = sessionStorage.getItem('id');
        return requester.get('user', endpoint);
    }
    
    function editUser(username, avatar, email, phone, fName, lName) {
        let id = sessionStorage.getItem('id');
        return requester.update('user', id, {username, avatar, email, phone, fName, lName})
    }


    return {
        userInfo,
        saveSession,
        login,
        register,
        logout,
        isAuthed,
        editUser
    }
})();