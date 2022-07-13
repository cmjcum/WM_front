const backend_base_url = "http://127.0.0.1:8000"
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

    //비밀번호 영문, 숫자, 특수조합 (8자리이상 입력) 정규식
    var pwdCheck = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

    if (!pwdCheck.test(signupData.password)) {
        alert("비밀번호는 영문, 숫자, 특수문자를 사용하여 8자리 이상으로 입력해주세요!");
        password.focus();
        return false;
    }

    // const response = await fetch('url 작성')
    const response = await fetch(`${backend_base_url}/user/`, {
            headers: {
                Accept: "application/json",
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(signupData)
        }
    )
    // signupData 를 json화 해준다.
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
    response_json = await response.json()

    if (response.status == 200) {
        // jwt token 의 access, refresh 값을 각각의 이름으로 저장한다.
        localStorage.setItem("access", response_json.access)
        localStorage.setItem("refresh", response_json.refresh)
        // access 값 파싱 작업
        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        localStorage.setItem("payload", jsonPayload);
        alert("안녕하세요 :)")
        // window.location.replace(`${frontend_base_url}/`);
    } else {
        alert("일치하지 않는 아이디나 비밀번호입니다.")
    }
}

function go_signup() {
    window.location.replace(`${frontend_base_url}/login/signup.html`)
}