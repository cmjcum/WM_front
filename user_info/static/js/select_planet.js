const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"

let planet_infos = {}

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

    while(floor_select.hasChildNodes()) {
        floor_select.removeChild(floor_select.firstChild)
    }

    let name = e.target.getAttribute('id')
    let empty_rooms = planet_infos[name]['empty_rooms']
    floor_select.setAttribute('name', name)

    for(let i=0; i<empty_rooms.length; i++) {
        let new_option = document.createElement('option')
        let key = Object.keys(empty_rooms[i])
        new_option.innerHTML = key
        new_option.setAttribute('value', key)
        floor_select.appendChild(new_option)
    }
}


function change_floor(e) {
    let number_select = document.getElementById('number_select')

    while(number_select.hasChildNodes()) {
        number_select.removeChild(number_select.firstChild)
    }

    let empty_room_numbers = planet_infos[e.target.getAttribute('name')]['empty_rooms'][e.target.value-1][e.target.value]
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

}