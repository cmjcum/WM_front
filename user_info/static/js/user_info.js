const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"


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
}