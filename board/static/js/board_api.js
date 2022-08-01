// url matching
const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"

// data type check
function jsType(data) {
    return Object.prototype.toString.call(data).slice(8, -1)
};

// URLSearchParams
function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
};

// pagenation
function makePagenation(board_id, current_page, total_data) {
    const data_per_page = 20; // 페이지 당 출력할 글 수
    const page_cnt = 5; // 출력할 페이지네이션 링크 수

    const total_pages = Math.ceil(total_data/data_per_page) // 총 페이지 수
    const page_group = Math.ceil(current_page/page_cnt) // 페이지 그룹
    
    // console.log("total_data : ", total_data)
    // console.log("total_pages : ", total_pages)
    // console.log("page_group : ", page_group)

    let last = page_group * page_cnt; // 화면에 보여질 마지막 페이지 번호
    if (last > total_pages) {
        last = total_pages;
    }
    let first = last - (page_cnt-1) // 화면에 보여질 첫번째 페이지 번호
    const next = last +1
    const prev = first -1

    if (total_pages < 1) {
        first = last
    }

    const pages = $("#pages")
    pages.empty();

    if (last > 5) {
        pages.append(
            `<li class="page-item">
            <a class="page-link" href="/board/board.html?board=${board_id}&page=${prev}"><i class="bi bi-chevron-double-left"></i></a>
            </li>`
        )
    }
    for (let j = first; j <= last; j++) {
        if (current_page == j) {
            pages.append(
                `<li class="page-item active">
                <a class="page-link" href="/board/board.html?board=${board_id}&page=${j}">${j}</a>
            </li>`
            )
        } else if (j > 0) {
            pages.append(
                `<li class="page-item">
                <a class="page-link" href="/board/board.html?board=${board_id}&page=${j}">${j}</a>
            </li>`
            )
        }
    }
        if (next > 5 && next < total_pages) {
            pages.append(
                `<li class="page-item">
                <a class="page-link" href="/board/board.html?board=${board_id}&page=${next}"><i class="bi bi-chevron-double-right"></i></a>
                </li>`
                )
        }
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

            if (data["admin_data"]) {
                // is_admin
                for (let i = 0; i < Object.keys(data["admin_data"]).length; i++) {
                    let planet_name = Object.keys(data["admin_data"])[i]
                    let planet_name_lower = planet_name.toLocaleLowerCase()
                    let planet_url =  Object.values(data["admin_data"])[i]
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

                if (data["planet_data"]) {
                    // 시민증 발급 완료
                    console.log("OK")
                    console.log(data["planet_data"])
                    let my_planet_url = data["planet_data"][2]
                    let my_planet_name = data["planet_data"][0]
                    let my_planet_name_lower = my_planet_name.toLowerCase()
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
    let current_page = searchParam('page');    

    const response = await fetch(`${backend_base_url}/board/${board_id}/list/${current_page}/`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {

            console.log(data)

            if (Object.keys(data) == "message") {
                let alert_temp = `<div class="card bg-primary px-4 py-4 mt-5 position-absolute top-50 start-50 translate-middle" style="max-width: 20rem;">
                                                        <div class="card-body">
                                                        <h4 class="card-title"><i class="bi bi-emoji-dizzy"></i> ${Object.values(data)}</h4>
                                                        <p class="card-text">글을 작성해보세요!</p>
                                                        </div>
                                                    </div>`
                $("#alert").append(alert_temp)

            } else {
                let total_data = data[0]["articles"];
                console.log("load board", board_id, current_page, total_data)
                makePagenation(board_id, current_page, total_data)

                for (let i = 0; i < Object.keys(data).length; i++) {

                    let num = data[0]["num"][i]
                    let title = data[i]["title"]
                    let detail_url = data[i]["detail_url"]
                    let author = data[i]["author_name"]
                    let author_id = data[i]["author"]
                    let create_date = data[i]["create_date"]
                    let comments = data[i]["comments"]
                    let likes = data[i]["likes"]

                    if (data[i]["moved"]) {
                        // 이사완료
                        if (data[i]["newest"]) {
                            list_temp = `<tr>
                                                            <th scope="row">${num}</th>
                                                            <td><a href="${detail_url}"><i class="bi bi-stars text-secondary me-3"></i>${title}</a></tdth>
                                                            <td><a href="/myroom/myroom.html?user=${author_id}">${author}</a></td>
                                                            <td>${create_date}</td>
                                                            <td>${comments}</td>
                                                            <td>${likes}</td>
                                                        </tr>`
                        } else {
                            list_temp = `<tr>
                                                            <th scope="row">${num}</th>
                                                            <td><a href="${detail_url}">${title}</a></th>
                                                            <td><a href="/myroom/myroom.html?user=${author_id}">${author}</a></td>
                                                            <td>${create_date}</td>
                                                            <td>${comments}</td>
                                                            <td>${likes}</td>
                                                        </tr>`
                        }
                    } else {
                        // 이사중
                        if (data[i]["newest"]) {
                            list_temp = `<tr>
                                                            <th scope="row">${num}</th>
                                                            <td><a href="${detail_url}"><i class="bi bi-stars text-secondary me-3"></i>${title}</a></tdth>
                                                            <td><a>${author}</a></td>
                                                            <td>${create_date}</td>
                                                            <td>${comments}</td>
                                                            <td>${likes}</td>
                                                        </tr>`
                        } else {
                            list_temp = `<tr>
                                                            <th scope="row">${num}</th>
                                                            <td><a href="${detail_url}">${title}</a></th>
                                                            <td><a>${author}</a></td>
                                                            <td>${create_date}</td>
                                                            <td>${comments}</td>
                                                            <td>${likes}</td>
                                                        </tr>`
                        }
                    }
                    $("#boardItems").append(list_temp)
            }  
            }
        }
    )
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
        let alert_temp = `<div class="alert alert-dismissible alert-secondary position-absolute">
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
                                                        <p class="card-text"><a href="${frontend_base_url}/board/board.html?board=${board_id}&page=1" class="text-success no-deco">목록으로 돌아가기 <i class="bi bi-arrow-counterclockwise"></i></a></p>
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

                    if (data[i]["newest"]) {
                        list_temp = `<tr>
                                                        <th scope="row">${num}</th>
                                                        <td><a href="${detail_url}"><i class="bi bi-stars text-secondary me-3"></i>${title}</a></tdth>
                                                        <td><a href="/myroom/myroom.html?user=${author_id}">${author}</a></td>
                                                        <td>${create_date}</td>
                                                        <td>${comments}</td>
                                                        <td>${likes}</td>
                                                    </tr>`
                    } else {
                        list_temp = `<tr>
                                                        <th scope="row">${num}</th>
                                                        <td><a href="${detail_url}">${title}</a></th>
                                                        <td><a href="/myroom/myroom.html?user=${author_id}">${author}</a></td>
                                                        <td>${create_date}</td>
                                                        <td>${comments}</td>
                                                        <td>${likes}</td>
                                                    </tr>`
                    }
                    
                    $("#boardItems").append(list_temp)
                }
            }

        })
}