const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"


function click_submit_button() {
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

    const name_en = document.getElementById('name_en')
    if(!name_en.value) {
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