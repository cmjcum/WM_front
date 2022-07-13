const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "https://d26fccab8r7c47.cloudfront.net"


function go_signup() {
    window.location.replace(`${frontend_base_url}/login/signup.html`)
}

function go_login() {
    window.location.replace(`${frontend_base_url}/login/login.html`)
}