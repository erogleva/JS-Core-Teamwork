let auth = (() => {
    function isAuthed() {
        return sessionStorage.getItem('authtoken') !== null;
    }
    
    function loginAsStupedUser() {
        let username = 'stupeduser';
        let password = 'stupeduser';
        return requester.post('user', 'login', {username, password}, 'basic');
    }

    function saveSession(data) {
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('id', data._id);
        sessionStorage.setItem('authtoken', data._kmd.authtoken);
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

    function getUserInfo(username) {

        return requester.get('user', `?query={"username":"${username}"}`);
    }

    function editUser(id, username, avatar, email, phone, fName, lName, points, userRole) {
        return requester.update('user', id, {username, avatar, email, phone, fName, lName, points, userRole})
    }

    function banUser(id, data) {
        return requester.update('user', id, data)
    }

    function unBanUser(id, data) {
        return requester.update('user', id, data)
    }

    return {
        getUserInfo,
        saveSession,
        login,
        register,
        logout,
        isAuthed,
        editUser,
        banUser,
        unBanUser,
        loginAsStupedUser
    }
})();