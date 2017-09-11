let usersService = (() => {
    function isAuthed() {
        return sessionStorage.getItem('authtoken') !== null &&
            sessionStorage.getItem('username') !== 'stupeduser';
    }

    function loginAsStupedUser() {
        let username = 'stupeduser';
        let password = 'stupeduser';

        return login(username, password);
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
        return requester.post('user', '_logout');
    }

    function getUserInfo(username) {
        return requester.get('user', `?query={"username":"${username}"}`);
    }

    function getUserById(id) {
        return requester.get('user', `?query={"_id":"${id}"}`);
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

    function checkUserNameAndPassword(username, password) {
        let usernameRegex = /[A-z]{3}/g;
        let passRegex = /[A-z\d]{6}/g;

        return (usernameRegex.test(username) && passRegex.test(password));
    }

    return {
        getUserInfo,
        getUserById,
        saveSession,
        login,
        register,
        logout,
        isAuthed,
        editUser,
        banUser,
        unBanUser,
        loginAsStupedUser,
        checkUserNameAndPassword
    }
})();