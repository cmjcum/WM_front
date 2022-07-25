// url matching
const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"


// data type check
function jsType(data) {
    return Object.prototype.toString.call(data).slice(8, -1)
}

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

            // console.log(typeof(data))
            // console.log(data)
            // console.log(jsType(data))

            // console.log(data[0])
            // console.log(data[1])
            // console.log(data[2])

            if (jsType(data) == "Object") {
                // is_admin
                temp = `<span class="text-warning vertical-middle me-3"><i class="bi bi-cone-striped"></i> 관리자로 접속중</span>`
            $("#isAdminNow").append(temp)
                
            } else {

                if (data[0] != null ) {
                    // 시민증 발급 완료
                    console.log("OK")
                    my_planet_url = data[0]
                    user_id = data[2]
                    nav_my_planet_temp = `<a class="nav-link" href="${my_planet_url}"><i class="bi bi-stars"></i> My planet</a>`
                    nav_my_home_temp = `<a class="nav-link" href="/myroom/myroom.html?user=${user_id}"><i class="bi bi-house-heart-fill"></i> My
                    home</a>`
                    $("#myPlanet").append(nav_my_planet_temp)
                    $("#myHome").append(nav_my_home_temp)
                    
                } else {
                        // 시민증 발급중
                        console.log("null")
                    }}

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

            // console.log(typeof(data))
            console.log(data)
            // console.log(jsType(data))

            // console.log(data[0])
            // console.log(data[1])
            // console.log(data[2])

            if (jsType(data) == "Object") {
                // is_admin
                // console.log(data)
                // console.log(Object.keys(data).length)
                for(let i = 0; i < Object.keys(data).length; i++) {
                    // console.log(Object.keys(data)[i])
                    // console.log(Object.values(data)[i])
                    planet_name = Object.keys(data)[i]
                    planet_name_lower = Object.keys(data)[i].toLocaleLowerCase()
                    planet_url = Object.values(data)[i]
                    planet_temp = `
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

                if (data[0] != null ) {
                    // 시민증 발급 완료
                    console.log("OK")
                    my_planet_url = data[0]
                    my_planet_name_lower = data[1].toLowerCase()
                    my_planet_name = data[1]
                    my_planet_temp = `
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
                    }}

        })
}


// method GET
// 게시판 목록 로딩
async function loadBoard() {
    let board_id = window.location.search.split('=')[1]
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

            // console.log(jsType(data))
            // console.log(Object.keys(data).length)
            // console.log(data)
            // console.log(data[2])

            // 글쓰기 버튼
            // btn_temp = `<a class="btn btn-secondary" href="article_write.html?board=${board_id}"><i class="bi bi-pencil-square"></i> 글쓰기</a>`
            // $("#postBtn").append(btn_temp)

            for(let i = 0; i < Object.keys(data).length; i++) {

                num = i+1
                title = data[i]["title"]
                detail_url = data[i]["detail_url"]
                author = data[i]["author"]
                author_id = data[i]["author_id"]
                create_date = data[i]["create_date"]
                comments = data[i]["comments"]
                likes = 0

                list_temp = `<tr>
                                            <th scope="row">${num}</th>
                                            <td><a href="${detail_url}">${title}</a></th>
                                            <td><a href="/myroom/myroom.html?user=${author_id}">${author}</a></td>
                                            <td>${create_date}</td>
                                            <td>${comments}</td>
                                            <td>${likes}</td>
                                        </tr>`
            $("#boardItems").append(list_temp)
            }

        })
}

// logoutbutton click
function logout() {
    window.localStorage.clear();
    window.location.replace(`${frontend_base_url}/login/login.html`);
    alert('logout success')
}

// post button click
function post_button_click() {
    let board_id = window.location.search.split('=')[1]
    window.location.replace(`${frontend_base_url}/board/article_write.html?board=${board_id}`);
}

// search button click
function search_button_click() {
    let board_id = window.location.search.split('=')[1]
    let searchData =  document.getElementById('searchInput').value
    window.location.replace(`${frontend_base_url}/board/article_write.html?board=${board_id}`);
}