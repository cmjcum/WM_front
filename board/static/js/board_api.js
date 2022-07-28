// url matching
const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"

// data type check
function jsType(data) {
    return Object.prototype.toString.call(data).slice(8, -1)
}

// URLSearchParams
function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
};

// method GET
// 상단바 로딩
async function loadNavbar() {
    console.log("load navbar")
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


            if (jsType(data) == "Object") {
                // is_admin
                let login_user_temp = `<span class="text-warning vertical-middle me-3"><i class="bi bi-cone-striped"></i> 관리자로 접속중</span>`
                $("#isAdminNow").append(login_user_temp)

            } else {
                if (data[1] != null) {
                    // 시민증 발급 완료
                    console.log("OK")
                    let my_planet_url = data[0]
                    let user_id = data[2]
                    let nav_my_planet_temp = `<a class="nav-link" href="${my_planet_url}"><i class="bi bi-stars"></i> My planet</a>`
                    let nav_my_home_temp = `<a class="nav-link" href="/myroom/myroom.html?user=${user_id}"><i class="bi bi-house-heart-fill"></i> My
                    home</a>`
                    $("#myPlanet").append(nav_my_planet_temp)
                    $("#myHome").append(nav_my_home_temp)
                    let login_user_temp = `<span class="text-success vertical-middle me-3">${data[3]} 님</span>`
                    $("#username").append(login_user_temp)

                } else {
                    // 시민증 발급중
                    console.log("null")
                    let login_user_temp = `<span class="text-success vertical-middle me-3">${data[0]} 님</span>`
                    $("#username").append(login_user_temp)
                }
            }

        })
}


// method GET
// 메인 페이지 로딩
async function loadMain() {
    console.log("load main")
    const response = await fetch(`${backend_base_url}/board/`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {

            if (jsType(data) == "Object") {
                // is_admin
                for (let i = 0; i < Object.keys(data).length; i++) {
                    let planet_name = Object.keys(data)[i]
                    let planet_name_lower = Object.keys(data)[i].toLocaleLowerCase()
                    let planet_url = Object.values(data)[i]
                    let planet_temp = `
                    <div class="board">
                        <img class="icon" src="/images/icon/${planet_name_lower}.png">
                        <div>
                            <a href="${planet_url}"><h2 class="text-primary">${planet_name}</h2></a>
                            <p class="text-primary">당신의 행성의 이웃들이 무슨 이야기를 나누고 있을까요?</p>
                        </div>
                    </div>`
                    $("#boardList").append(planet_temp)
                }

            } else {

                if (data[0] != null) {
                    // 시민증 발급 완료
                    console.log("OK")
                    let my_planet_url = data[0]
                    let my_planet_name_lower = data[1].toLowerCase()
                    let my_planet_name = data[1]
                    let my_planet_temp = `
                    <div class="board">
                        <a href="${my_planet_url}">
                        <img class="icon" src="/images/icon/${my_planet_name_lower}.png">
                        <div>
                            <h2 class="text-primary">${my_planet_name}</h2>
                            <p class="text-primary">당신의 행성의 이웃들이 무슨 이야기를 나누고 있을까요?</p>
                        </div>
                        </a>
                    </div>`
                    $("#boardList").append(my_planet_temp)

                } else {
                    // 시민증 발급중
                    console.log("null")
                }
            }

        })
}


// method GET
// 게시판 목록 로딩
async function loadBoard() {
    let board_id = searchParam('board');
    console.log("load board", board_id)

    const response = await fetch(`${backend_base_url}/board/${board_id}/`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {

            for (let i = 0; i < Object.keys(data).length; i++) {

                let num = i + 1
                let title = data[i]["title"]
                let detail_url = data[i]["detail_url"]
                let author = data[i]["author_name"]
                let author_id = data[i]["author"]
                let create_date = data[i]["create_date"]
                let comments = data[i]["comments"]
                let likes = data[i]["likes"]

                let list_temp = `<tr>
                                            <th scope="row">${num}</th>
                                            <td><a href="${detail_url}">${title}</a></th>
                                            <td><a href="/myroom/myroom.html?user=${author_id}">${author}</a></td>
                                            <td>${create_date}</td>
                                            <td>${comments}</td>
                                            <td>${likes}</td>
                                        </tr>`
                $("#boardItems").append(list_temp)
            }

        }
    )
}

// logoutbutton click
function logout() {
    window.localStorage.clear();
    window.location.replace(`${frontend_base_url}/login/login.html`);
    alert('logout success')
}

// post button click
function postButtonClick() {
    let board_id = searchParam('board');
    window.location.replace(`${frontend_base_url}/board/article_write.html?board=${board_id}`);
}

// search button click
function searchButtonClick() {
    let board_id = searchParam('board');
    let searchData = document.getElementById('searchInput').value
    console.log(board_id, searchData)
    if (searchData.length == 0) {
        let alert_temp = `<div class="alert alert-dismissible alert-secondary w-25 position-absolute">
                                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                        <p class="mb-0">검색어를 입력해주세요!</p>
                                    </div>`
        $("#alert").append(alert_temp)
    } else {
        window.location.replace(`${frontend_base_url}/board/board.html?board=${board_id}&search=${searchData}`);
    }
}


// 게시글 검색 결과 로딩
async function loadSearchData() {
    let keyword = searchParam('search');
    let board_id = searchParam('board');
    console.log("load search data", board_id, keyword)

    const response = await fetch(`${backend_base_url}/board/${board_id}/search/${keyword}/`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {

            if (Object.keys(data) == "message") {
                let alert_temp = `<div class="card bg-primary px-4 py-4 mt-5 position-absolute top-50 start-50 translate-middle" style="max-width: 20rem;">
                <div class="card-body">
                  <h4 class="card-title"><i class="bi bi-emoji-dizzy"></i> ${Object.values(data)}</h4>
                  <p class="card-text"><a href="${frontend_base_url}/board/board.html?board=${board_id}" class="text-success no-deco">목록으로 돌아가기 <i class="bi bi-arrow-counterclockwise"></i></a></p>
                </div>
              </div>`
                $("#alert").append(alert_temp)

            } else {
                for (let i = 0; i < Object.keys(data).length; i++) {

                    let num = i + 1
                    let title = data[i]["title"]
                    let detail_url = data[i]["detail_url"]
                    let author = data[i]["author_name"]
                    let author_id = data[i]["author"]
                    let create_date = data[i]["create_date"]
                    let comments = data[i]["comments"]
                    let likes = data[i]["likes"]

                    let list_temp = `<tr>
                                                        <th scope="row">${num}</th>
                                                        <td><a href="${detail_url}">${title}</a></th>
                                                        <td><a href="/myroom/myroom.html?user=${author_id}">${author}</a></td>
                                                        <td>${create_date}</td>
                                                        <td>${comments}</td>
                                                        <td>${likes}</td>
                                                    </tr>`
                    $("#boardItems").append(list_temp)
                }
            }

        })
}