$(document).ready(function() {
    skip_login()
});


function skip_login() {
    let token = localStorage.getItem('access')
    var base64Url = token.split('.')[1]; //value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    let result = JSON.parse(jsonPayload)
    console.log(result)
    let token_exp = result['exp']
    console.log(token_exp)
    let cur_time = Date.now() / 1000;
    console.log(cur_time)
    if (cur_time < token_exp) {
        window.location.replace(`${frontend_base_url}/board/index.html`)
    } else {
        pass
    }
}






function go_signup() {
    window.location.replace(`${frontend_base_url}/login/signup.html`)
}

function go_login() {
    window.location.replace(`${frontend_base_url}/login/login.html`)
}

function go_board() {
    window.location.replace(`${frontend_base_url}/board/index.html`)
}