const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"


// 모달창 띄우기
function show_modal() {
    const open = () => {
        document.body.classList.add("stop-scroll");
        document.querySelector(".modal").style.display = "flex";
        console.log(document.querySelector(".modal").classList)
    }
    const close = () => {
        document.body.classList.remove("stop-scroll");
        document.querySelector(".modal").style.display = "none";
    }
    document.querySelector(".openBtn").addEventListener("click", open);
    document.querySelector(".closeBtn").addEventListener("click", close);
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
        alert('방명록이 작성됬습니다.')
        window.location.reload();
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
        window.location.reload();
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
                        <div class="guestbook_user">
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
                if (i == 4) break;
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
                const birthday = data[i]["birthday"]
                const portrait = data[i]["portrait"]
                const coin = data[i]["coin"]
                const floor = data[i]["floor"]
                const room_number = data[i]["room_number"]
                // User.data
                const like_count = data[i]["user"]["like_count"]
                const follower_count = data[i]["user"]["follower_count"]
                const follow_count = data[i]["user"]["follow_count"]
                const nickname = data[i]["user"]["nickname"]
                const like_user = data[i]["user"]["like_user"]
                const follow_user = data[i]["user"]["follow_user"]
                // Plant.data
                const planet = data[i]["planet"]["name"]
                // 팔로우한 유저의 정보의 변수
                const follow_user_data = data[i]["user"]["follow"]

                if (login_user_id == user_id) {
                    content_temp = `
                <div class="profile-wrap" style="display:flex;">
                    <div class="profile-portrait"><img class="profile-portrait" src="${portrait}"></div>
                    <!-- 유저 정보 -->
                    <div class="profile-name" id="profile_name">
                        <div class="my_profile_name" style="font-size: 12px;">${nickname}</div>
                            <div class="card card-body" style="border: 0; padding: 0px; margin: 5px auto auto auto">
                                <div class="my-profile">행성:&nbsp;${planet}</div>
                                <div class="my-profile">층수:&nbsp;${room_number} &nbsp; 호수:&nbsp;${floor}</div>
                                <div class="my-profile">생일:&nbsp;${birthday}</div>
                                <div class="my-profile"; style="margin-bottom: 5px;">코인:&nbsp;${coin}</div>
                            </div>
                    </div>
                </div>

                <div class="likes_follows_wrap" style="display:flex;">
                    <div class="profile-name" id="profile_name">
                        <div class="likes_follows">
                            좋아요:${like_count} &nbsp 팔로워:${follower_count} &nbsp 팔로우:${follow_count}
                        </div>
                    </div>
                </div>
            
                <!-- 방 꾸미기 -->
                <div id="buttons_div" style="text-align: center;">
                    <button class="btn_furniture badge" id="edit_button" data-bs-target="#collapseExample"
                        aria-expanded="false" aria-controls="collapseExample" data-bs-toggle="collapse" type="button"
                        onclick="click_edit_button(event)">방꾸미기</button>
                </div>
                <div class="collapse" id="collapseExample">
                    <div class="card card-body">
                        <div id="furniture_div" class="furniture_div" style="float: right;"></div>
                    </div>
                </div>
                `
                    $("#show_profile").append(content_temp)
                } else {
                    content_temp = `
                <div class="profile-wrap" style="display:flex;">
                    <div class="profile-portrait"><img class="profile-portrait" src="${portrait}"></div>
                    <!-- 유저 정보 -->
                    <div class="profile-name" id="profile_name">
                        <div class="my_profile_name" style="font-size: 12px;">${nickname}</div>
                            <div class="card card-body" style="border: 0; padding: 0px; margin: 5px auto auto auto">
                                <div class="my-profile">행성:&nbsp;${planet}</div>
                                <div class="my-profile">층수:&nbsp;${room_number} &nbsp; 호수:&nbsp;${floor}</div>
                                <div class="my-profile">생일:&nbsp;${birthday}</div>
                            </div>
                    </div>
                </div>
                <div class="likes_follows_wrap" style="display:flex;">
                    <div class="profile-name" id="profile_name">
                        <div class="likes_follows">
                            좋아요:${like_count} &nbsp 팔로워:${follower_count} &nbsp 팔로우:${follow_count}
                        </div>
                    </div>
                </div>
                `
                    $("#show_profile").append(content_temp)
                    // 좋아요 팔로우
                    if (follow_user == true) {
                        content_temp = `
                        <script>
                            $(".btn_like").click(function () {
                                $(this).toggleClass("done");
                            })
                        </script>
                        <div id="buttons_div" style="float:right;">
                            <button class="fs-4 btn_like badge rounded-pill" onclick="follow()" style="margin: -1px 15px 0px 0px; color: inherit;"><i class="bi bi-person-plus"></i></button>
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
                            <button class="fs-4 btn_like badge rounded-pill" onclick="follow()" style="margin: -1px 15px 0px 0px;"><i class="bi bi-person-plus"></i></button>
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
                        <button class="fs-5 btn_like badge rounded-pill" onclick="like()" style="color: inherit;"><i class="bi bi-heart"></i></button>
                    </div>
                    <div style='height: 50px;'></div>
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
                        <button class="fs-5 btn_like badge rounded-pill" onclick="like()"><i class="bi bi-heart"></i></button>
                    </div>
                    <div style='height: 50px;'></div>
                    `
                        $("#show_profile").append(content_temp)
                    }
                    // 팔로우한 유저의 프로필
                    for (let i = 0; i < follow_user_data.length; i++) {
                        const follow_user_nickname = follow_user_data[i]["follow_user_nickname"]
                        const follow_user_portrait = follow_user_data[i]["portrait"]
                        const follow_user_id = follow_user_data[i]["id"]

                        content_temp = `
                        <a href="${frontend_base_url}/myroom/myroom.html?user=${follow_user_id}">
                            <div class="follow_profile_wrap" style="display:flex;">
                        
                                <div class="follow_profile_portrait">
                                    <img class="follow_profile_portrait" src="${follow_user_portrait}">
                                </div>
                                
                                <div class="follow_profile_name">
                                    <div style="font-size: 13px;">${follow_user_nickname}</div>
                                </div>
                            </div>
                        </a>
                        `
                    if (i == 6) break;
                    $("#show_profile").append(content_temp)
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
    window.location.reload();
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
    window.location.reload();
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
    window.location.reload();
}