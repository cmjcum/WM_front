const backend_base_url = "https://coumi.makmigrations.click"
const frontend_base_url = "https://d26fccab8r7c47.cloudfront.net"


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

    const birthday = document.getElementById('birthday')
    if(!birthday.value) {
        alert('생년월일을 입력해주세요!')
        birthday.focus()
        return
    }

    let birthday_reg_ex = /^\d{4}-\d{2}-\d{2}$/
    if(!birthday_reg_ex.test(birthday.value)) {
        alert('생년월일을 형식에 맞게 입력해주세요!')
        birthday.focus()
        return
    }

    let birthday_split_list = birthday.value.split('-')
    if(birthday_split_list[1]<1 && birthday_split_list[1]>12) {
        alert('생년월일을 형식에 맞게 입력해주세요!')
        birthday.focus()
        return
    }

    if(birthday_split_list[2]<1 && birthday_split_list[2]>31) {
        alert('생년월일을 형식에 맞게 입력해주세요!')
        birthday.focus()
        return
    }

    const agree_check = document.getElementById('agree_check')
    if(!agree_check.checked) {
        alert('동의 여부를 체크해주세요!')
        return
    }

    let form_data = new FormData()
    form_data.append('portrait', file)
    form_data.append('name', name_ko.value)
    form_data.append('name_eng', name_eng.value)
    form_data.append('birthday', birthday.value)
    
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


window.onload = function() {
    document.getElementById('face_picture').addEventListener('change', (e) => { show_picture(e) })
    document.getElementById('submit_button').addEventListener('click', click_submit_button)
}