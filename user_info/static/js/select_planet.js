const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"

let planet_info = {}

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
                planet_info[cur_data['name']] = {
                    'max_floor': cur_data['max_floor'],
                    'max_number': cur_data['max_number'],
                    'population': cur_data['population'],
                    'empty_rooms': cur_data['empty_rooms']
                }
            }
        });
}

window.onload = function() {
    load_planet_info()

}