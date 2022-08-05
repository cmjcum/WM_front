const backend_base_url = "https://coumi.makemigrations.click"
const frontend_base_url = "https://makemigrations.click"

const planet_names = {
    'Mercury': '수성',
    'Venus': '금성',
    'Earth': '지구',
    'Mars': '화성',
    'Jupiter': '목성',
    'Saturn': '토성',
    'Uranus': '천왕성',
    'Neptune': '해왕성'
}

let planet_infos = {}


async function click_submit_button() {
    const floor_select = document.getElementById('floor_select')
    const info_data = {
        'planet': floor_select.getAttribute('name'),
        'floor': floor_select.value,
        'room_number': document.getElementById('number_select').value
    }

    const response = await fetch(`${backend_base_url}/user/planet/`, {
        headers: {
            Authorization : "Bearer " + localStorage.getItem("access"),
            Accept: "application/json",
            'Content-type': 'application/json'},
        withCredentials: true,
        method: 'POST',
        body: JSON.stringify(info_data)
    }
    ).then(response => {
        if (response.status == 200) {
            alert('이주를 환영합니다! 사진이 만들어지는 동안 태양계를 둘러보세요:)')
            window.location.replace(`${frontend_base_url}/board/index.html`)
        }
        if (response.status == 400) {
            response.json().then(
                data => {
                    alert(data['error'])
                }
            )
            window.location.reload()
        }
    })
}


function remove_all_children(parent) {
    while(parent.hasChildNodes()) {
        parent.removeChild(parent.firstChild)
    }
}


async function load_planet_info() {
    const response = await fetch(`${backend_base_url}/user/planet/`, {
        method: 'GET',
        headers: { Authorization: "Bearer " + localStorage.getItem("access") },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {
            for(let i=0; i<data.length; i++) {
                cur_data = data[i]
                planet_infos[cur_data['name']] = {
                    'max_floor': cur_data['max_floor'],
                    'max_number': cur_data['max_number'],
                    'population': cur_data['population'],
                    'empty_rooms': cur_data['empty_rooms']
                }
            }
        });
}


function click_planet(e) {
    let floor_select = document.getElementById('floor_select')

    remove_all_children(floor_select)

    let name = e.target.getAttribute('id')
    let planet_info = planet_infos[name]
    let empty_rooms = planet_info['empty_rooms']
    floor_select.setAttribute('name', name)

    for(let i=0; i<empty_rooms.length; i++) {
        let new_option = document.createElement('option')
        let key = Object.keys(empty_rooms[i])
        new_option.innerHTML = key
        new_option.setAttribute('value', key)
        floor_select.appendChild(new_option)
    }

    let number_select = document.getElementById('number_select')

    remove_all_children(number_select)

    let first_empty_room_numbers = empty_rooms[0][Object.keys(empty_rooms[0])]
    for(let i=0; i<first_empty_room_numbers.length; i++) {
        let new_option = document.createElement('option')
        new_option.innerHTML = first_empty_room_numbers[i]
        new_option.setAttribute('value', first_empty_room_numbers[i])
        number_select.appendChild(new_option)
    }

    let population_name_p = document.getElementById('population_name_p')
    population_name_p.innerHTML = `총 ${planet_info['population']}명의 사람이 ${planet_names[name]}에 살고 있어요!`

    document.getElementById('modal_title').innerHTML = `${planet_names[name]}으로 가시겠어요?`
}


function change_floor(e) {
    let number_select = document.getElementById('number_select')

    remove_all_children(number_select)

    let empty_room_numbers = planet_infos[e.target.getAttribute('name')]['empty_rooms'][e.target.selectedIndex][e.target.value]
    for(let i=0; i<empty_room_numbers.length; i++) {
        let new_option = document.createElement('option')
        new_option.innerHTML = empty_room_numbers[i]
        new_option.setAttribute('value', empty_room_numbers[i])
        number_select.appendChild(new_option)
    }
}


window.onload = function() {
    load_planet_info()

    document.getElementById('click_arrow').addEventListener('click', (e) => { e.target.parentNode.parentNode.style.display = 'none' })
    document.getElementById('floor_select').addEventListener('change', (e) => { change_floor(e) })

    planets = document.getElementsByClassName('scale')
    for(let i=0; i<planets.length; i++) {
        planets[i].addEventListener('click', (e) => {click_planet(e)})
    }

    document.getElementById('submit_button').addEventListener('click', click_submit_button)

}