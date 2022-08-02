// URLSearchParams
function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
};

// method GET
// 상단바 로딩
async function loadNavbar() {
    const response = await fetch(`${backend_base_url}/board/`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {

            const payload = JSON.parse(localStorage.getItem("payload"));
            if (!payload) {
                // 토큰이 없을 시 로그인 페이지로 replace
                window.location.replace(`${frontend_base_url}/login/login.html`);
            } else if (payload.exp < (Date.now() / 1000)) {
                // 토큰의 유효기간 만료 시 로그인 페이지로 replace
                window.location.replace(`${frontend_base_url}/login/login.html`);
            };

            if (data["admin_data"]) {
                // is_admin
                let login_user_temp = `<span class="text-warning vertical-middle me-3"><i class="bi bi-cone-striped"></i> 관리자로 접속중</span>`
                $("#username").append(login_user_temp)

            } else {
                if (data["planet_data"]) {
                    // 시민증 발급 완료
                    let my_planet_url = data["planet_data"][2]
                    let user_id = data["user_id"]
                    let nav_my_planet_temp = `<a class="nav-link" href="${my_planet_url}"><i class="bi bi-stars"></i> My planet</a>`
                    let nav_my_home_temp = `<a class="nav-link" href="/myroom/myroom.html?user=${user_id}"><i class="bi bi-house-heart-fill"></i> My
                    home</a>`
                    $("#myPlanet").append(nav_my_planet_temp)
                    $("#myHome").append(nav_my_home_temp)
                } else {
                    // 시민증 발급중
                    console.log("null")
                }

                let login_user_temp = `<span class="text-success vertical-middle me-3">${data["nickname"]} 님</span>`
                $("#username").append(login_user_temp)

                if (searchParam('board')) {
                    let board_id = searchParam('board');
                    if (board_id==8) {
                        // 솔라에 액티브
                        console.log("solarSystem")
                        $( '#solarSystem' ).children().addClass( 'active' )
                    } else {
                        // 마이플래닛에 액티브
                        console.log("myPlanet")
                        $( '#myPlanet' ).children().addClass( 'active' )
                    }
                } else if (searchParam('user')) {
                    // 마이홈에 액티브
                    $( '#myHome' ).children().addClass( 'active' )
                } else {
                    // 메인 페이지에 액티브
                }

            }

        })
}

// logoutbutton click
function logout() {
    window.localStorage.clear();
    window.location.replace(`${frontend_base_url}/login/login.html`);
}