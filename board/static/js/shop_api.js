async function buyFurniture(furniture_id) {

    const contentData = {
        furniture: furniture_id,
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
        alert(response_json['msg'])
        window.location.reload();
    }
    else if (response.status == 400) {
        alert(response_json['error'])
        window.location.reload();
    }
    else {
        alert('권한이 없습니다.')
    }

}


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

            if (data.length == 0) {
                let alert_temp = `<div class="card bg-primary px-4 py-4 mt-5 position-absolute top-50 start-50 translate-middle" style="max-width: 400px; height: auto;">
                                                        <div class="card-body">
                                                        <h4 class="card-title">새로운 상품이 오는 중이에요<i class="bi bi-truck ms-2" ></i></h4>
                                                        <p class="card-text">재입고를 기다려주세요!</p>
                                                        </div>
                                                    </div>`
                $("#alert").append(alert_temp)
            } else {

                for (let i = 0; i < data.length; i++) {
                    let furniture_id = data[i].id
                    let name = data[i].name
                    let img_url = data[i].url_left
                    let price = data[i].price
                    let html_temp = `<div class="col goods mb-3">
                                                            <div class="card border-primary position-relative" style="max-width: 20rem;">
                                                                <div class="card-header text-primary">${name}</div>
                                                                <div class="card-body pt-0">
                                                                    <figure class="d-flex furniture-container">
                                                                        <img class=" mx-auto"
                                                                            src="${img_url}">
                                                                    </figure>
                                                                    <h5 class="card-title text-primary">${price} coin</h5>
                                                                    <p class="card-text text-primary mb-3 position-absolute bottom-0 start-50 translate-middle-x"><button type="button"
                                                                            class="btn btn-secondary" onclick="buyFurniture(${furniture_id})">구입하기</button></p>
                                                                </div>
                                                            </div>
                                                        </div>`
                    $("#goodsList").append(html_temp)
            }
        }
        })
}