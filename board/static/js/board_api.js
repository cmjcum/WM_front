const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"


function jsType(data) {
    return Object.prototype.toString.call(data).slice(8, -1)
};


function searchParam(key) {
    return new URLSearchParams(location.search).get(key);
};


function makePagenation(board_id, current_page, total_data) {
    const data_per_page = 20;
    const page_cnt = 5;

    const total_pages = Math.ceil(total_data / data_per_page)
    const page_group = Math.ceil(current_page / page_cnt)

    let last = page_group * page_cnt;
    if (last > total_pages) {
        last = total_pages;
    }
    let first = last - (page_cnt - 1)
    const next = last + 1
    const prev = first - 1

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


async function loadMain() {
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
                for (let i = 0; i < Object.keys(data["admin_data"]).length; i++) {
                    let planet_name = Object.keys(data["admin_data"])[i]
                    let planet_name_lower = planet_name.toLocaleLowerCase()
                    let planet_url = Object.values(data["admin_data"])[i]
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

                }

            }
        }) 
        
    }


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
            
            if (Object.keys(data) == "detail") {
                window.location.replace(`${frontend_base_url}/board/error.html`);

            } else if (Object.keys(data) == "message") {
                let alert_temp = `<div class="card bg-primary px-4 py-4 mt-5 position-absolute top-50 start-50 translate-middle" style="max-width: 20rem; height: auto;">
                                                        <div class="card-body">
                                                            <h4 class="card-title"><i class="bi bi-emoji-dizzy"></i> ${Object.values(data)}</h4>
                                                            <p class="card-text">글을 작성해보세요!</p>
                                                        </div>
                                                    </div>`
                $("#alert").append(alert_temp)

            }  else {
                let total_data = data[0]["count"];
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


function logout() {
    window.localStorage.clear();
    window.location.replace(`${frontend_base_url}/login/login.html`);
    alert('logout success')
}


function postButtonClick() {
    let board_id = searchParam('board');
    window.location.replace(`${frontend_base_url}/board/article_write.html?board=${board_id}`);
}


function searchButtonClick() {
    let board_id = searchParam('board');
    let searchData = document.getElementById('searchInput').value
    if (searchData.length == 0) {
        let alert_temp = `<div class="alert alert-dismissible alert-secondary position-absolute">
                                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                            <p class="mb-0">검색어를 입력해주세요!</p>
                                        </div>`
        $("#alert").append(alert_temp)
    } else {
        window.location.replace(`${frontend_base_url}/board/board.html?board=${board_id}&search=${searchData}&page=1`);
    }
}


async function loadSearchData() {
    let keyword = searchParam('search');
    let board_id = searchParam('board');
    let current_page = searchParam('page');

    const response = await fetch(`${backend_base_url}/board/${board_id}/search/${keyword}/${current_page}/`, {
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
                let total_data = data[0]["count"];
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