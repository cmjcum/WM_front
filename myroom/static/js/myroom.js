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
    document.getElementById("guestbook_modal_button").addEventListener("click", open);
    document.querySelector(".closeBtn").addEventListener("click", close);
});

// 주민증 모달창
function open_card_modal() {
    document.body.classList.add("stop_scroll");
    document.querySelector(".resident_card_modal").style.display = "flex";
}

function close_card_modal() {
    document.body.classList.remove("stop_scroll");
    document.querySelector(".resident_card_modal").style.display = "none";
}

// 방명록 설명 모달
function open_furniture_manual_modal() {
    document.body.classList.add("stop_scroll");
    document.querySelector(".furniture_manual_modal").style.display = "flex";
}

function close_furniture_manual_modal() {
    document.body.classList.remove("stop_scroll");
    document.querySelector(".furniture_manual_modal").style.display = "none";
}

// 상메 모달
function open_status_message() {
    document.body.classList.add("stop_scroll");
    document.querySelector(".status_messages").style.display = "flex";
}

function close_status_message() {
    document.body.classList.remove("stop_scroll");
    document.querySelector(".status_messages").style.display = "none";
}

// 프로필 사진 수정 모달
function open_portrait_correction() {
    document.body.classList.add("stop_scroll");
    document.querySelector(".portrait_correction").style.display = "flex";
}

function close_portrait_correction() {
    document.body.classList.remove("stop_scroll");
    document.querySelector(".portrait_correction").style.display = "none";
}


// 프로필 사진 수정
async function save_portrait_correction() {
    let owner_id = window.location.search.split('=')[1]
    const formdata = new FormData();
    const portrait = document.getElementById('face_picture').files[0]
    formdata.append('portrait', portrait)

    const response = await fetch(`${backend_base_url}/user/${owner_id}/`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("access"), },
        body: formdata,
        method: 'PUT',
    }
    )

    if (response.status == 200) {
        content_temp = `<p>프로필이 수정이 시작 되었습니다. 
                        <br>적용까지는 시간이 조금 걸려요~
                        <br>다른 곳에서 놀다 오세용~~</p>`
        $("#portrait_message").empty()
        $("#portrait_save_btn").remove()
        $("#portrait_message").append(content_temp)
    } else {
        content_temp = `<p>사진을 다시 선택해 주세요.</p>`
        $("#portrait_message").append(content_temp)
    }
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


async function status_messge() {
    let owner_id = window.location.search.split('=')[1]
    const status_data = {
        status_message: document.getElementById('status_message').value,
    }
    console.log(status_data)

    const response = await fetch(`${backend_base_url}/myroom/${owner_id}/`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
            Accept: "application/json",
            'Content-type': 'application/json'
        },
        withCredentials: true,
        method: 'PUT',

        body: JSON.stringify(status_data)
    }
    )
    response_json = await response.json()
    window.location.reload(true);
}


async function putArticle() {
    let board_id = searchParam('board');
    let article_id = searchParam('article');

    const title = document.getElementById("inputTitle").value
    const content = document.getElementById("inputContent").value

    const formdata = new FormData();

    formdata.append('title', title)
    formdata.append('content', content)

    const response = await fetch(`${backend_base_url}/board/${board_id}/edit/${article_id}/`, {
        method: 'PUT',
        headers: { Authorization: "Bearer " + localStorage.getItem("access"), },
        body: formdata
    })

    if (response.status == 200) {
        window.location.replace(`${frontend_base_url}/board/article.html?board=${board_id}&article=${article_id}`);
    } else {
        alert("작성 실패")
    }
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
                const status_message = data[i]["status_message"]
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
                    <div class="status_message_box">${status_message}</div>
                    `
                    $("#status_message_content").append(content_temp)

                    content_temp = `
                    <div class="profile_wrap" style="display:flex;">
                        <div class="profile_portrait position-relative">
                            <img class="profile_portrait" src="${portrait}">
                            <button class="portrait_btn text-secondary position-absolute top-0 start-100 translate-middle"
                                onclick="open_portrait_correction()"><i class="bi bi-gear-fill"></i></button>
                        </div>
                        <!-- 프로필 사진 수정 -->
                        <div class="portrait_correction">
                            <div class="portrait_correction_modal card text-white bg-primary mb-3" style="border-radius: 15px;">
                                <div class="card-header" style="margin: auto;">프로필 사진 수정</div>
                                <div class="input-div" id="portrait_message" style="margin: auto;">
                                    <label class="face-picture-label" for="face_picture">
                                        <div id="face_picture_div" class="face-picture-div">
                                            <img class="profile_portrait" style="width: 150px; height: 150px;" src="${portrait}">
                                        </div>
                                    </label>
                                </div>
                                <input class="form-control d-block" type="file" accept=".jpg, .png, .jpeg, .bmp" id="face_picture">
                                <div class="btn_set" style="margin: auto;">
                                    <button type="button" id="portrait_save_btn" class="modal_btn fs-6 btn btn-primary"
                                        style="border: solid 1px; margin: 3px;" onclick="save_portrait_correction()">저장</button>
                                    <button class="modal_btn fs-6 close_status_message btn btn-primary"
                                        style="border: solid 1px; margin: 3px;" onclick="close_portrait_correction()">닫기</button>
                                </div>
                            </div>
                        </div>
                        <!-- 유저 정보 -->
                        <div class="profile_name" id="profile_name">
                            <div class="my_profile_name" style="font-size: 15px;">${nickname}</div>
                            <div class="card card-body" style="border: 0; padding: 0px; margin: 5px auto auto auto">
                                <div class="my_profile">행성:&nbsp;${planet}</div>
                                <div class="my_profile">생일:&nbsp;${birthday}</div>
                                <div class="my_profile">${coin} coin</div>
                            </div>
                        </div>
                    </div>
                    `
                    $("#show_profile").append(content_temp)


                    // 상메, 시민증 모달
                    content_temp = `
                    <button type="button" class="status_messages_btn" onclick="open_status_message()">상태 메세지</button>
                    <!-- 상메 모달 -->
                    <div class="status_messages">
                        <div class="status_message_modal card text-white bg-primary mb-3" style="border-radius: 15px;">
                            <div class="card-header" style="margin: auto;">상태 메세지</div>
                            <textarea id="status_message" class="status_message_text" style="border-radius: 15px;"></textarea>
                            <div class="btn_set" style="margin: auto;">
                                <button type="button" class="modal_btn fs-6 btn btn-primary" style="border: solid 1px; margin: 3px;"
                                    onclick="status_messge()">완료</button>
                                <button class="modal_btn fs-6 close_status_message btn btn-primary"
                                    style="border: solid 1px; margin: 3px;" onclick="close_status_message()">닫기</button>
                            </div>
                        </div>
                    </div>
                    <!-- 시민증 모달 -->
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

                                    <div class="text-center gap-2 mb-3">
                                        <h3 class="card-title">${name}</h3>
                                        <h5 class="card-title">${name_eng}</h5>
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
                        <div id="buttons_div" style="position:absolute; right:50px; top:520px;">
                            <button class="btn_furniture badge" id="edit_button" data-bs-target="#collapseExample"
                                aria-expanded="false" aria-controls="collapseExample" data-bs-toggle="collapse" type="button"
                                onclick="click_edit_button(event)" style="font-size:16px; border-radius:10px;">꾸미기</button>
                        </div>
                        <div class="collapse furniture_wrap" id="collapseExample">
                            <div class="card card-body" style="border: 0; margin-top: 50px;">
                                <div id="furniture_div" class="furniture_div" style="float: right;"></div>
                            </div>
                        </div>
                    </div>
                    `
                    $("#show_furniture").append(content_temp)

                    // 도움말 버튼
                    content_temp = `
                    <div style="text-align: right;">
                        <div style="position:absolute; right:18px; top:513px;">
                            <button class="fs-3 btn_furniture_manual" onclick="open_furniture_manual_modal()"><i
                                    class="bi bi-question-circle-fill"></i></button>
                            <div class="furniture_manual_modal">
                                <div class="furniture_manual_warp card text-white bg-primary mb-3" style="border-radius: 15px;">
                                    <div class="card-header" style="margin: auto; font-size: 20px">꾸미기 사용법</div>
                                    <div class="furniture_manual_content" style="border-radius: 15px;">
                                        <div class="furniture_manual_text" style="text-align: left; margin: 20px 0px 0px 15px;">
                                            <b>Q 가구는 어떻게 배치하나요?</b>
                                            <ul>
                                                <li>꾸미기 버튼을 누릅니다.</li>
                                                <li>배치하고자 하는 가구를 마우스로 클릭 후 배치합니다.</li>
                                                <li>완료 버튼을 눌러서 저장합니다.</li>
                                            </ul>
                                            <b>Q 가구를 지우고 싶어요</b>
                                            <ul>
                                                <li>꾸미기 버튼을 누릅니다.</li>
                                                <li>지우기 버튼을 누릅니다.</li>
                                                <li>지우기 하고자 하는 가구를 마우스로 클릭합니다.</li>
                                            </ul>
                                            <b>Q 가구를 다른 각도로도 배치하고 싶어요</b>
                                            <ul>
                                                <li>꾸미기 버튼을 누릅니다.</li>
                                                <li>회전 버튼을 누릅니다.</li>
                                                <li>원하는 각도로 가구를 배치합니다.</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="btn_set" style="margin: auto;">
                                        <button class="modal_btn fs-6 btn btn-primary" style="border: solid 1px; margin: 3px;"
                                            onclick="close_furniture_manual_modal()">닫기</button>
                                    </div>
                                </div>
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