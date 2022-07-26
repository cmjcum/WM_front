const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"

async function load_planet_info() {
    const response = await fetch(`${backend_base_url}/user/planet/`, {
        method: 'GET',
        headers: { Authorization: "Bearer " + localStorage.getItem("access") },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        });
}

window.onload = function() {
    load_planet_info()
}