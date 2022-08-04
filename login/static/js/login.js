const backend_base_url = "https://coumi.makemigrations.click"
const frontend_base_url = "https://d26fccab8r7c47.cloudfront.net"


async function handleSignup() {
    
    const signupData = {
        nickname: document.getElementById('signup_nick').value,
        username: document.getElementById("signup_id").value,
        password: document.getElementById('signup_pw').value,
    }

    if (signupData.nickname == "") {
        alert("닉네임을 입력하세요.");
        nickname.focus();
        return false;
    }

    if (signupData.username == "") {
        alert("아이디를 입력하세요.");
        username.focus(); 
        return false;
    }

    if (signupData.password == "") {
        alert("비밀번호를 입력하세요.");
        password.focus();
        return false;
    }

    
    var pwdCheck = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

    if (!pwdCheck.test(signupData.password)) {
        alert("비밀번호는 영문, 숫자, 특수문자를 사용하여 8자리 이상으로 입력해주세요!");
        password.focus();
        return false;
    }

    
    const response = await fetch(`${backend_base_url}/user/`, {
            headers: {
                Accept: "application/json",
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(signupData)
        }
    )

    response_json = await response.json()

    if (response.status == 200) {
        alert('예비 외계인이 되신 것을 환영합니다!')
        window.location.reload();
        window.location.replace(`${frontend_base_url}/login/login.html`);

    } else {
        alert('다시 입력해 주세요')
    }
}


async function handleLogin() {
    const loginData = {
        username: document.getElementById("login_id").value,
        password: document.getElementById('login_pw').value
    }
    const response = await fetch(`${backend_base_url}/user/api/token/`, {
            headers: {
                Accept: "application/json",
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(loginData)
        }
    )

    if (response.status == 200) {
        response.json().then(data => {
        localStorage.setItem("access", data.access)
        localStorage.setItem("refresh", data.refresh)
        
        const base64Url = data.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''))
        
        localStorage.setItem("payload", jsonPayload)
        const user_id = JSON.parse(localStorage.getItem("payload")).user_id
        const user_name = JSON.parse(localStorage.getItem("payload")).username
        const user_planet = JSON.parse(localStorage.getItem("payload")).planet
        const today_pt = JSON.parse(localStorage.getItem("payload")).today_pt

        console.log('user_id:', user_id, 'username:', user_name, 'planet_id:', user_planet, 'today_pt:', today_pt)
        
        if (user_planet == null) {
            alert("아직 이주할 행성을 선택하지 않으셨네요! 이주신청서를 작성해주세요 :)")
            window.location.replace(`${frontend_base_url}/user_info/user_info.html`)
        } else {
            if (today_pt == true) {
                alert("안녕하세요 :) 오늘도 출첵 보상 100pt !!")
                window.location.replace(`${frontend_base_url}/board/index.html`)
            } else {
                alert("얼굴 자주보니 좋네요!!")
                window.location.replace(`${frontend_base_url}/board/index.html`)
            }
        }})
    } else {
        alert("일치하지 않는 아이디나 비밀번호입니다.")
    }
}


function go_signup() {
    window.location.replace(`${frontend_base_url}/login/signup.html`)
}


function go_login() {
    window.location.replace(`${frontend_base_url}/login/login.html`)
}


function signup_enter() {
    if (window.event.keyCode === 13) {
        handleSignup()
    }
}


function login_enter() {
    if (window.event.keyCode === 13) {
        handleLogin()
    }
}