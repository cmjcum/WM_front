// method POST
// 가구 구매하기
async function buyFurniture(furniture_id) {

    const contentData = {
        id: furniture_id,
    }

    const response = await fetch(`${backend_base_url}/myroom/shop/`, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
            Accept: "application/json",
            'Content-type': 'application/json',
        },
        withCredentials: true,
        body: JSON.stringify(contentData)
    }
    )
    response_json = await response.json()

    if (response.status == 200) {
        window.location.reload();
    } else {
        alert('권한이 없습니다.')
    }
}


// method GET
// 메인 페이지 로딩
async function loadFurniture() {
    const response = await fetch(`${backend_base_url}/myroom/shop/`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {

            for (let i = 0; i < data.length; i++) {
                let furniture_id = data[i].id
                let name = data[i].name
                let img_url = data[i].url_left
                let price = data[i].price
                let html_temp = `<div class="col goods mb-3">
                                                        <div class="card border-primary" style="max-width: 20rem;">
                                                            <div class="card-header text-primary">${name}</div>
                                                            <div class="card-body pt-0">
                                                                <figure class="d-flex">
                                                                    <img class=" mx-auto"
                                                                        src="${img_url}">
                                                                </figure>
                                                                <h5 class="card-title text-primary">${price} coin</h5>
                                                                <p class="card-text text-primary mt-4"><button type="button"
                                                                        class="btn btn-secondary" onclick="buyFurniture(${furniture_id})">구입하기</button></p>
                                                            </div>
                                                        </div>
                                                    </div>`
                $("#goodsList").append(html_temp)
            }

        })
}