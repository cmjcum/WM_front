// 방명록 모달창 띄우기
$(document).ready(function () {
    const open = () => {
        document.body.classList.add("stop_scroll");
        document.querySelector(".modal").style.display = "flex";
    }
    const close = () => {
        document.body.classList.remove("stop_scroll");
        document.querySelector(".modal").style.display = "none";
    }
    document.querySelector(".openBtn").addEventListener("click", open);
    document.querySelector(".closeBtn").addEventListener("click", close);
});

function open_card_modal() {
    document.body.classList.add("stop_scroll");
    document.querySelector(".resident_card_modal").style.display = "flex";
    guest_modal.ClassList.call("open")
}

function close_card_modal() {
    document.body.classList.add("stop_scroll");
    document.querySelector(".resident_card_modal").style.display = "none";
    guest_modal.ClassList.call("close")
}


// 방명록 작성
async function write_guest_book() {
    let owner_id = window.location.search.split('=')[1]
    const contentData = {
        content: document.getElementById('guestBookData').value,
    }
    const response = await fetch(`${backend_base_url}/myroom/user/${owner_id}/`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
            Accept: "application/json",
            'Content-type': 'application/json'
        },
        withCredentials: true,
        method: 'POST',

        body: JSON.stringify(contentData)
    }
    )
    response_json = await response.json()

    if (response.status == 200) {
        alert('방명록이 작성됐습니다.')
        window.location.reload(true);
    } else {
        alert('다시 작성해 주세요')
    }
}


// 방명록 삭제
async function delete_guest(book_id) {
    let guest_book_id = $(book_id).val();
    const response = await fetch(`${backend_base_url}/myroom/book/${guest_book_id}/`, {

        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
        },
    })
    response_json = await response.json()

    if (response.status == 200) {
        alert('삭제 되었습니다.')
        window.location.reload(true);
    } else {
        alert('권한이 없습니다.')
    }
}


// 방명록 조회
async function show_guest_book() {
    let owner_id = window.location.search.split('=')[1]
    const response = await fetch(`${backend_base_url}/myroom/user/${owner_id}/`, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
        },
    })
        .then(response => response.json())
        .then(data => {
            // JSON.parse() 데이터를 실제 json화 시켜준다.
            const login_user = JSON.parse(localStorage.getItem("payload")).user_id

            for (let i = 0; i < data.length; i++) {
                let content = data[i]["content"]
                let nickname = data[i]["nickname"]
                let create_date = data[i]["create_date"]

                // 방명록을 작성한 유저
                const author_id = data[i].author_id
                if (login_user == author_id) {
                    content_temp = `
                    <div class="guestbook">
                        <button type="button" class="fs-6 guestbook_delete badge rounded-pill bg-primary" onclick="delete_guest(this)"
                            value=${data[i]["id"]}>삭제</button>
                        <div class="guestbook_user fs-6">
                            <p class="guestbook_nickname"><b>${nickname}</b><span>&nbsp| ${create_date}</span></p>
                        </div>
                        <div class="guestbook_data">${content}</div>
                    </div>`
                    $("#guest_book").append(content_temp)
                } else {
                    content_temp = `
                    <div class="guestbook">
                        <div class="guestbook_user">
                            <p class="guestbook_nickname"><b>${nickname}</b><span>&nbsp| ${create_date}</span></p>
                        </div>
                        <div class="guestbook_data">${content}</div>
                    </div>`
                    $("#guest_book").append(content_temp)
                }
            }
        })
}


// 회원 정보 조회
async function show_profile() {
    let owner_id = window.location.search.split('=')[1]
    const response = await fetch(`${backend_base_url}/myroom/${owner_id}/`, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
        },
    })
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                const login_user_id = JSON.parse(localStorage.getItem("payload")).user_id
                const user_id = data[i].user_id

                // UserInfo.data
                const name = data[i]["name"]
                const name_eng = data[i]["name_eng"]
                const birthday = data[i]["birthday"]
                const portrait = data[i]["portrait"]
                const coin = data[i]["coin"]
                const floor = data[i]["floor"]
                const room_number = data[i]["room_number"]
                const identification_number = data[i]["identification_number"]
                const create_date = data[i]["create_date"]
                // User.data
                const like_count = data[i]["user"]["like_count"]
                const follower_count = data[i]["user"]["follower_count"]
                const follow_count = data[i]["user"]["follow_count"]
                const nickname = data[i]["user"]["nickname"]
                const like_user = data[i]["user"]["like_user"]
                const follow_user = data[i]["user"]["follow_user"]
                // Plant.data
                const planet = data[i]["planet"]["name"]
                // 태그한 유저의 정보의 변수
                const follower_user_data = data[i]["user"]["follow"]
                const follow_users_data = data[i]["user"]["follow_users"]
                const like_user_data = data[i]["user"]["like"]

                if (login_user_id == user_id) {
                    content_temp = `
                    <div class="profile_wrap" style="display:flex;">
                        <div class="profile_portrait"><img class="profile_portrait" src="${portrait}"></div>
                        <!-- 유저 정보 -->
                        <div class="profile_name" id="profile_name">
                            <div class="my_profile_name" style="font-size: 15px;">${nickname}</div>
                                <div class="card card-body" style="border: 0; padding: 0px; margin: 5px auto auto auto">
                                    <div class="my_profile">행성:&nbsp;${planet}</div>
                                    <div class="my_profile">생일:&nbsp;${birthday}</div>
                                    <div class="my_profile">${coin}  coin</div>
                                </div>
                        </div>
                    </div>
                    `
                    $("#show_profile").append(content_temp)

                    // 시민증 모달
                    content_temp = `
                    <button class="open resident_card_btn" onclick="open_card_modal()" style="color: yellow;"><i class="bi bi-star-fill me-1"></i>ID card</button>
                    <div class="resident_card_modal">
                        <div class="card bg-primary resident_card_wrap">
                            <div class="card-header d-flex justify-content-between px-4">
                                <h3 style="letter-spacing: 11px;">IdentityCard</h3>
                                <h6 class="pt-2">ID : ${identification_number}</h6>
                            </div>

                            <div class="card-body d-flex justify-content-between">

                                <div class="resident_profile_portrait ps-1">
                                    <img class="resident_profile_portrait" src="${portrait}">
                                </div>

                                <div class="ps-3 py-2 ms-4 w-75">

                                    <div class="d-flex justify-content-between mb-4">
                                        <h2 class="card-title">${name}</h2>
                                        <h2 class="card-title">${name_eng}</h2>
                                    </div>

                                    <div class="d-flex justify-content-between">
                                        <p class="card-text">Birthday</p>
                                        <p class="card-text">${birthday}</p>
                                    </div>
      
                                    <div class="d-flex justify-content-between">
                                        <p class="card-text">Adress</p>
                                        <p class="card-text">Solar System-${planet}-${floor * 100 + room_number}</p>
                                    </div>

                                </div>

                            </div>

                            <div class="card-footer py-1">
                                <p class="card-text text-center lh-sm" style="letter-spacing: 8px;">${create_date}<br><span class="fs-5">Make Migrations In ${planet}</span></p>
                            </div>

                            <div class="btn_set position-absolute top-0 start-100 translate-middle">
                                <button onclick="close_card_modal()" class="modal_btn close btn fs-4 text-primary"><i class="bi bi-x-lg" style="background-color:#fff; border-radius:30%;"></i></button>
                            </div>
                        </div>
                    </div>
                    `
                    $("#show_profile").append(content_temp)

                    content_temp = `
                    <div style="float: right; font-size:12px; color:white; margin-bottom: 10px;">${like_count}명</div>
                    `
                    $("#like_count").append(content_temp)

                    content_temp = `
                    <div style="float: right; font-size:12px; color:white; margin-bottom: 10px;">${follower_count}명</div>
                    `
                    $("#follower_count").append(content_temp)

                    content_temp = `
                    <div style="float: right; font-size:12px; color:white; margin-bottom: 10px;">${follow_count}명</div>
                    `
                    $("#follow_count").append(content_temp)

                    // 방꾸미기 버튼
                    content_temp = `
                    <div style="text-align: right;">
                        <div id="buttons_div" style="position:absolute; right:35px; top:520px;">
                            <button class="btn_furniture badge" id="edit_button" data-bs-target="#collapseExample"
                                aria-expanded="false" aria-controls="collapseExample" data-bs-toggle="collapse" type="button"
                                onclick="click_edit_button(event)" style="font-size:16px; border-radius:10px;">꾸미기</button>
                        </div>
                        <div class="collapse furniture_wrap" id="collapseExample">
                            <div class="card card-body" style="border: 0; margin-top: 40px;">
                                <div id="furniture_div" class="furniture_div" style="float: right;"></div>
                            </div>
                        </div>
                    </div>
                    `
                    $("#show_furniture").append(content_temp)

                    // 팔로워한 유저의 프로필
                    for (let i = 0; i < follower_user_data.length; i++) {
                        const follower_user_nickname = follower_user_data[i]["follower_user_nickname"]
                        const follower_user_portrait = follower_user_data[i]["portrait"]
                        const follower_user_id = follower_user_data[i]["id"]

                        content_temp = `
                        <a href="${frontend_base_url}/myroom/myroom.html?user=${follower_user_id}" style="text-decoration: none;">
                            <div class="follow_profile_wrap" style="display:flex;">
                        
                                <div class="follow_profile_portrait">
                                    <img class="follow_profile_portrait" src="${follower_user_portrait}">
                                </div>
                                
                                <div class="follow_profile_name">
                                    <div style="font-size: 15px;">${follower_user_nickname}</div>
                                </div>
                            </div>
                        </a>
                        `
                        $("#follower_info").append(content_temp)
                    }
                    // 좋아요한 유저의 프로필
                    for (let i = 0; i < like_user_data.length; i++) {
                        const like_user_nickname = like_user_data[i]["like_user_nickname"]
                        const like_user_portrait = like_user_data[i]["portrait"]
                        const like_user_id = like_user_data[i]["id"]

                        content_temp = `
                        <a href="${frontend_base_url}/myroom/myroom.html?user=${like_user_id}" style="text-decoration: none;">
                            <div class="follow_profile_wrap" style="display:flex;">
                        
                                <div class="follow_profile_portrait">
                                    <img class="follow_profile_portrait" src="${like_user_portrait}">
                                </div>
                                
                                <div class="follow_profile_name">
                                    <div style="font-size: 15px;">${like_user_nickname}</div>
                                </div>
                            </div>
                        </a>
                        `
                        $("#like_info").append(content_temp)
                    }
                    // 팔로우한 유저의 프로필
                    for (let i = 0; i < follow_users_data.length; i++) {
                        const follow_user_nickname = follow_users_data[i]["follower_user_nickname"]
                        const follow_user_portrait = follow_users_data[i]["portrait"]
                        const follow_user_id = follow_users_data[i]["id"]

                        content_temp = `
                        <a href="${frontend_base_url}/myroom/myroom.html?user=${follow_user_id}" style="text-decoration: none;">
                            <div class="follow_profile_wrap" style="display:flex;">
                        
                                <div class="follow_profile_portrait">
                                    <img class="follow_profile_portrait" src="${follow_user_portrait}">
                                </div>
                                
                                <div class="follow_profile_name">
                                    <div style="font-size: 15px;">${follow_user_nickname}</div>
                                </div>
                            </div>
                        </a>
                        `
                        $("#follow_info").append(content_temp)
                    }
                } else {
                    content_temp = `
                    <div class="profile_wrap" style="display:flex;">
                        <div class="profile_portrait"><img class="profile_portrait" src="${portrait}"></div>
                        <!-- 유저 정보 -->
                        <div class="profile_name" id="profile_name">
                            <div class="my_profile_name" style="font-size: 15px;">${nickname}</div>
                                <div class="card card-body" style="border: 0; padding: 0px; margin: 5px auto auto auto">
                                    <div class="my_profile">행성:&nbsp;${planet}</div>
                                    <div class="my_profile">생일:&nbsp;${birthday}</div>
                                </div>
                        </div>
                    </div>
                    `
                    $("#show_profile").append(content_temp)

                    content_temp = `
                    <div style="float: right; font-size:12px; color:white; margin-bottom: 10px;">${like_count}명</div>
                    `
                    $("#like_count").append(content_temp)

                    content_temp = `
                    <div style="float: right; font-size:12px; color:white; margin-bottom: 10px;">${follower_count}명</div>
                    `
                    $("#follower_count").append(content_temp)

                    content_temp = `
                    <div style="float: right; font-size:12px; color:white; margin-bottom: 10px;">${follow_count}명</div>
                    `
                    $("#follow_count").append(content_temp)

                    // 좋아요 팔로우
                    if (follow_user == true) {
                        content_temp = `
                        <script>
                            $(".btn_like").click(function () {
                                $(this).toggleClass("done");
                            })
                        </script>
                        <div id="buttons_div" style="float:right;">
                            <button class="fs-3 btn_like badge rounded-pill" onclick="follow()" style="color: inherit; padding: 7px;"><i class="bi bi-person-plus"></i></button>
                        </div>
                        `
                        $("#show_profile").append(content_temp)
                    }
                    else {
                        content_temp = `
                        <script>
                            $(".btn_like").click(function () {
                                $(this).toggleClass("done");
                            })
                        </script>
                        <div id="buttons_div" style="float:right;">
                            <button class="fs-3 btn_like badge rounded-pill" onclick="follow()" style="padding: 7px;"><i class="bi bi-person-plus"></i></button>
                        </div>
                        `
                        $("#show_profile").append(content_temp)
                    }
                    if (like_user == true) {
                        content_temp = `
                        <script>
                            $(".btn_like").click(function () {
                                $(this).toggleClass("done");
                            })
                        </script>
                        <div id="buttons_div" style="float:right;">
                            <button class="fs-4 btn_like badge rounded-pill" onclick="like()" style="color: inherit; margin: 5px 0px 10px 0px; padding: 5px;"><i class="bi bi-heart"></i></button>
                        </div>
                        `
                        $("#show_profile").append(content_temp)
                    } else {
                        content_temp = `
                        <script>
                            $(".btn_like").click(function () {
                                $(this).toggleClass("done");
                            })
                        </script>
                        <div id="buttons_div" style="float:right;">
                            <button class="fs-4 btn_like badge rounded-pill" onclick="like()" style="margin: 5px 0px 10px 0px; padding: 5px;"><i class="bi bi-heart"></i></button>
                        </div>
                        `
                        $("#show_profile").append(content_temp)
                    }
                    // 팔로워한 유저의 프로필
                    for (let i = 0; i < follower_user_data.length; i++) {
                        const follower_user_nickname = follower_user_data[i]["follower_user_nickname"]
                        const follower_user_portrait = follower_user_data[i]["portrait"]
                        const follower_user_id = follower_user_data[i]["id"]

                        content_temp = `
                        <a href="${frontend_base_url}/myroom/myroom.html?user=${follower_user_id}" style="text-decoration: none;">
                            <div class="follow_profile_wrap" style="display:flex;">
                        
                                <div class="follow_profile_portrait">
                                    <img class="follow_profile_portrait" src="${follower_user_portrait}">
                                </div>
                                
                                <div class="follow_profile_name">
                                    <div style="font-size: 15px;">${follower_user_nickname}</div>
                                </div>
                            </div>
                        </a>
                        `
                        $("#follower_info").append(content_temp)
                    }
                    // 좋아요한 유저의 프로필
                    for (let i = 0; i < like_user_data.length; i++) {
                        const like_user_nickname = like_user_data[i]["like_user_nickname"]
                        const like_user_portrait = like_user_data[i]["portrait"]
                        const like_user_id = like_user_data[i]["id"]

                        content_temp = `
                        <a href="${frontend_base_url}/myroom/myroom.html?user=${like_user_id}" style="text-decoration: none;">
                            <div class="follow_profile_wrap" style="display:flex;">
                        
                                <div class="follow_profile_portrait">
                                    <img class="follow_profile_portrait" src="${like_user_portrait}">
                                </div>
                                
                                <div class="follow_profile_name">
                                    <div style="font-size: 15px;">${like_user_nickname}</div>
                                </div>
                            </div>
                        </a>
                        `
                        $("#like_info").append(content_temp)
                    }
                    // 팔로우한 유저의 프로필
                    for (let i = 0; i < follow_users_data.length; i++) {
                        const follow_user_nickname = follow_users_data[i]["follower_user_nickname"]
                        const follow_user_portrait = follow_users_data[i]["portrait"]
                        const follow_user_id = follow_users_data[i]["id"]

                        content_temp = `
                        <a href="${frontend_base_url}/myroom/myroom.html?user=${follow_user_id}" style="text-decoration: none;">
                            <div class="follow_profile_wrap" style="display:flex;">
                        
                                <div class="follow_profile_portrait">
                                    <img class="follow_profile_portrait" src="${follow_user_portrait}">
                                </div>
                                
                                <div class="follow_profile_name">
                                    <div style="font-size: 15px;">${follow_user_nickname}</div>
                                </div>
                            </div>
                        </a>
                        `
                        $("#follow_info").append(content_temp)
                    }
                }
            }
        })
}


// 좋아요
async function like() {
    let owner_id = window.location.search.split('=')[1]
    const contentData = {
        content: document.getElementById('guestBookData').value,
    }

    const response = await fetch(`${backend_base_url}/myroom/like/${owner_id}/`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
            Accept: "application/json",
            'Content-type': 'application/json'
        },
        withCredentials: true,
        method: 'POST',

        body: JSON.stringify(contentData)
    }
    )
    response_json = await response.json()
    window.location.reload(true);
}


async function follow() {
    let owner_id = window.location.search.split('=')[1]
    const contentData = {
        content: document.getElementById('guestBookData').value,
    }

    const response = await fetch(`${backend_base_url}/myroom/follow/${owner_id}/`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
            Accept: "application/json",
            'Content-type': 'application/json'
        },
        withCredentials: true,
        method: 'POST',

        body: JSON.stringify(contentData)
    }
    )
    response_json = await response.json()
    window.location.reload(true);
}


// 팔로우 한 사람들의 목록 get / 링크 post
async function follow_follow() {
    let owner_id = window.location.search.split('=')[1]
    const contentData = {
        content: document.getElementById('guestBookData').value,
    }

    const response = await fetch(`${backend_base_url}/myroom/follow/${owner_id}/`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
            Accept: "application/json",
            'Content-type': 'application/json'
        },
        withCredentials: true,
        method: 'POST',

        body: JSON.stringify(contentData)
    }
    )
    response_json = await response.json()
    window.location.reload(true);
}