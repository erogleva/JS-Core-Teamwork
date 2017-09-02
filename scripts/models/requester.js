let requester = (() => {
    const baseUrl = "https://baas.kinvey.com/";
    const appKey = "kid_BJAvHJ_Kb";
    const appSecret = "ff16a3ea058f4ad3bf75039cce6fa363";

    function makeAuth(type) {
        if (type === 'basic') {
            return 'Basic ' + btoa(appKey + ':' + appSecret);
        } else {
            return 'Kinvey ' + sessionStorage.getItem('authtoken');
        }
    }

    function makeRequest(method, module, url, auth) {
        return {
            url: baseUrl + module + '/' + appKey + '/' + url,
            method,
            headers: {
                'Authorization': makeAuth(auth)
            }
        };
    }

    function get(module, url, auth) {
        return $.ajax(makeRequest('GET', module, url, auth));
    }

    function post(module, url, data, auth) {
        let req = makeRequest('POST', module, url, auth);
        req.data = JSON.stringify(data);
        req.headers['Content-Type'] = 'application/json';

        return $.ajax(req);
    }

    function update(module, url, data, auth) {
        let req = makeRequest('PUT', module, url, auth);
        req.data = JSON.stringify(data);
        req.headers['Content-Type'] = 'application/json';

        return $.ajax(req);
    }

    function del(module, url, auth) {
        return $.ajax(makeRequest('DELETE', module, url, auth));
    }

    return {
        get,
        post,
        update,
        del
    }
})();