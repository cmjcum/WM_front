async function click_submit_button() {
    const file = document.getElementById('face_picture').files[0]
    if(!file) {
        alert('사진을 선택해주세요!')
        return
    }

    const name_ko = document.getElementById('name_ko')
    if(!name_ko.value) {
        alert('이름을 입력해주세요!')
        name_ko.focus()
        return
    }

    const name_eng = document.getElementById('name_eng')
    if(!name_eng.value) {
        alert('영문 이름을 입력해주세요!')
        name_en.focus()
        return
    }

    const year = document.getElementById('year')
    if(!year.value) {
        alert('태어난 연도를 입력해주세요!')
        year.focus()
        return
    }

    const agree_check = document.getElementById('agree_check')
    if(!agree_check.checked) {
        alert('동의 여부를 체크해주세요!')
        return
    }

    birthday = `${year.value}-${document.getElementById('month_select').value}-${document.getElementById('date_select').value}`
    
    let form_data = new FormData()
    form_data.append('portrait', file)
    form_data.append('name', name_ko.value)
    form_data.append('name_eng', name_eng.value)
    form_data.append('birthday', birthday)

    document.getElementById('loading').style.display = 'flex'
    
    const response = await fetch(`${backend_base_url}/user/user_info/`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("access") },
        withCredentials: true,
        method: 'POST',
        body: form_data
    }
    ).then(response => {
        if (response.status == 200) {
            window.location.replace(`${frontend_base_url}/user_info/select_planet.html`)
        }
        else if (response.status == 400) {
            alert(response.status)
            document.getElementById('loading').style.display = 'none'
        }
        else {
            alert('권한이 없습니다.')
            window.location.replace(`${frontend_base_url}/board/index.html`)
        }
    })

}


function show_picture(e) {
    let file = e.target.files[0];

    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
        let face_picture_div = document.getElementById('face_picture_div')
        face_picture_div.innerHTML = ''
        face_picture_div.style.backgroundColor = 'white'
        face_picture_div.style.backgroundImage = `url(${reader.result})`
    }
}


function change_month() {
    let month_select = document.getElementById('month_select')
    let date_select = document.getElementById('date_select')

    while(date_select.hasChildNodes()) {
        date_select.removeChild(date_select.firstChild)
    }

    let month = month_select.value

    let date = 30
    if (month == 2)
        date = 29
    else if ((month <= 7 && month % 2 == 1) || (month >= 8 && month % 2 == 0))
        date = 31

    for(let i=1; i<=date; i++) {
        let new_option = document.createElement('option')
        new_option.innerHTML = `${i}일`
        new_option.setAttribute('value', i)
        date_select.appendChild(new_option)
    }
}


window.onload = function() {
    document.getElementById('face_picture').addEventListener('change', (e) => { show_picture(e) })
    document.getElementById('submit_button').addEventListener('click', click_submit_button)
    document.getElementById('month_select').addEventListener('change', change_month)

    for(let i=1; i<=31; i++) {
        let new_option = document.createElement('option')
        new_option.innerHTML = `${i}일`
        new_option.setAttribute('value', i)
        date_select.appendChild(new_option)
    }
}