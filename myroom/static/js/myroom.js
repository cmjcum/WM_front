const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"


function show_modal() {
    const open = () => {
        document.querySelector(".modal").classList.remove("hidden");
    }

    const close = () => {
        document.querySelector(".modal").classList.add("hidden");
    }
    document.querySelector(".openBtn").addEventListener("click", open);
    document.querySelector(".closeBtn").addEventListener("click", close);
    document.querySelector(".bg").addEventListener("click", close);
}


async function write_guest_book() {
    let owner_id = window.location.search.split('=')[1]
    const contentData = {
        content: document.getElementById('guestBookData').value,
    }
    // <owner_id>
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
                    <button type="button" class="guestbook_delete" onclick="delete_guest(this)" value=${data[i]["id"]}>삭제</button>
                    <div class="guestbook_user">
                        <b>${nickname}</b><span>&nbsp| ${create_date}</span>
                    </div>
                    <div class="guestbook_data">${content}</div>
                </div>`
                    $("#guest_book").append(content_temp)
                } else {
                    content_temp = `
                    <div class="guestbook">
                        <div class="guestbook_user">
                            <b>${nickname}</b><span>&nbsp| ${create_date}</span>
                        </div>
                        <div class="guestbook_data">${content}</div>
                    </div>`
                    $("#guest_book").append(content_temp)
                }
            }
        })
}


// 회원 정보
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
                const name = data[i]["name"]
                const birthday = data[i]["birthday"]
                const portrait = data[i]["portrait"]
                const coin = data[i]["coin"]

                content_temp = `
                <div class="profile">
                    <div class="profile-portrait"><img class="profile-portrait" src="${portrait}"></div>
                    <div class="profile-name" id="profile_name">${name}</div>
                    <div class="my-profile">생일:&nbsp;${birthday}</div>
                    <div class="my-profile">코인:&nbsp;${coin}</div>
                    <div id="buttons_div">
                        <button id="edit_button" onclick="click_edit_button(event)">편집</button>
                    </div>
                    <div id="furniture_div"></div>
                `
                $("#show_profile").append(content_temp)
            }
        })
}