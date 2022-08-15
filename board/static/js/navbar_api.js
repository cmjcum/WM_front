function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
};


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
                window.location.replace(`${frontend_base_url}/login/login.html`);
            } else if (payload.exp < (Date.now() / 1000)) {
                window.location.replace(`${frontend_base_url}/login/login.html`);
            };

            if (data["admin_data"]) {
                let login_user_temp = `<span class="text-warning vertical-middle me-3"><i class="bi bi-cone-striped"></i> 관리자로 접속중</span>`
                $("#username").append(login_user_temp)

            } else {
                if (data["planet_data"]) {
                    let my_planet_url = data["planet_data"][2]
                    let user_id = data["user_id"]
                    let nav_my_planet_temp = `<a class="nav-link" href="${my_planet_url}"><i class="bi bi-stars"></i> My planet</a>`
                    let nav_my_home_temp = `<a class="nav-link" href="/myroom/myroom.html?user=${user_id}"><i class="bi bi-house-heart-fill"></i> My
                    home</a>`
                    let nav_shop_temp = `<a class="nav-link" href="/board/shop.html"><i class="bi bi-shop me-1"></i>Market</a>`
                    $("#myPlanet").append(nav_my_planet_temp)
                    $("#myHome").append(nav_my_home_temp)
                    $("#coinShop").append(nav_shop_temp)
                }

                let login_user_temp = `${data["nickname"]} 님`
                $("#username").append(login_user_temp)

                if (searchParam('board')) {
                    let board_id = searchParam('board');
                    if (board_id==8) {
                        $( '#solarSystem' ).children().addClass( 'active' )
                    } else {
                        $( '#myPlanet' ).children().addClass( 'active' )
                    }
                } else if (searchParam('user')) {
                    $( '#myHome' ).children().addClass( 'active' )
                } else if (window.location.href.split('/board/')[1] == "shop.html") {
                    $( '#coinShop' ).children().addClass( 'active' )
                } else {
                    $( '#mainPage' ).addClass( 'active' )
                }

            }

        })
}


function logout() {
    window.localStorage.clear();
    window.location.replace(`${frontend_base_url}/login/login.html`);
}