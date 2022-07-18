const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "https://d26fccab8r7c47.cloudfront.net"


let img;
let is_clicked = false;
let index = 0;

let furniture_positions = [];

const cursor = document.createElement('img');

function click_room(e) {
    if(is_clicked) {
        cursor.remove();

        let left = e.offsetX - img.naturalWidth / 2;
        let top = e.offsetY - img.naturalHeight / 2;

        img.style.position = 'absolute';
        img.style.left = `${left}px`;
        img.style.top = `${top}px`;

        img.addEventListener('click', (e) => {
            e.target.remove();
        });

        let new_furniture = {
            'myfurniture': parseInt(img.getAttribute('value')),
            'pos_x': left,
            'pos_y': top,
            'is_left': is_left
        }

        furniture_positions[index] = new_furniture

        img.setAttribute('id', index);

        index++;

        document.getElementById('room').appendChild(img);

        is_clicked = false;
    }
}


function change_cursor(e) {
    if(is_clicked) {
        cursor.setAttribute('id', 'cursor');

        cursor.setAttribute('src', img.getAttribute('src'))

        cursor.style.position = 'absolute';

        cursor.style.left = `${e.offsetX - img.naturalWidth / 2}px`;
        cursor.style.top = `${e.offsetY - img.naturalHeight / 2}px`;

        document.getElementById('room').appendChild(cursor);
    }
}


let is_left = true

async function get_my_furniture() {
    const response = await fetch(`${backend_base_url}/myroom/test/`, {
        method: 'GET',
        headers: { Authorization: "Bearer " + localStorage.getItem("access") },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {
            for(let i = 0; i < data.my_furniture.length; i++) {
                let cur_furniture = data.my_furniture[i]['furniture']

                let furniture_button = document.createElement('button')

                furniture_button.addEventListener('click', () => {
                    img = document.createElement('img');
                    img.setAttribute('value', data.my_furniture[i]['id'])
                    is_left ? img.setAttribute('src', cur_furniture['url_left']) : img.setAttribute('src', cur_furniture['url_right']);
                    img.style.pointerEvents = 'none'
                    is_clicked = true

                    document.getElementById('remove_button').innerHTML = '지우기';
                })

                furniture_button.innerHTML = cur_furniture['name']

                document.getElementById('furniture_div').appendChild(furniture_button)
            }
        });
}

function click_edit_button(e) {
    if(e.target.innerHTML == '편집') {
        e.target.innerHTML = '완료'
        get_my_furniture()
    }
    else {
        e.target.innerHTML = '편집'

        let furniture_div = document.getElementById('furniture_div')
        let childs = furniture_div.childNodes
        let length = childs.length
        for(let i=0; i<length; i++)
            furniture_div.removeChild(childs[0])
        save_room()
    }
}


async function load_room() {
    const response = await fetch(`${backend_base_url}/myroom/room/`, {
        method: 'GET',
        headers: { Authorization: "Bearer " + localStorage.getItem("access") },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {
            
        });
}


async function save_room() {
    const furniture_position_data = {'data': furniture_positions}
    console.log(JSON.stringify(furniture_position_data))
    const response = await fetch(`${backend_base_url}/myroom/room/`, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
            Accept: "application/json",
            'Content-type': 'application/json'},
        withCredentials: true,
        body: JSON.stringify(furniture_position_data)
    })
        .then(response => {
            if (response.status == 200) {
                window.location.reload()
            }
            
            if (response.status == 400) {
                alert(response.status)
            }
        });

}


window.onload = function () {

    document.getElementById("edit_button").addEventListener('click', (e) => {click_edit_button(e)});

    // get_my_furniture()
    const room = document.getElementById('room');

    room.addEventListener('click', click_room)
    room.addEventListener('mousemove', change_cursor)

    document.getElementById('remove_button').addEventListener('click', (e) => {
        let room_childs = document.getElementById('room').childNodes
        //e.target.innerHTML == '지우기' ? e.target.innerHTML = '배치' : e.target.innerHTML = '지우기'
        if(e.target.innerHTML == '지우기') {
            cursor.remove();
            is_clicked = false;
            e.target.innerHTML = '배치하기';
            for(i=0; i<room_childs.length; i++)
                room_childs[i].style.pointerEvents = 'auto';
        }
        else {
            e.target.innerHTML = '지우기';
            for(i=0; i<room_childs.length; i++)
                room_childs[i].style.pointerEvents = 'none';
        }
    })

    document.getElementById('rotate_button').addEventListener('click', () => {
        cursor.remove()
        is_left ? is_left = false : is_left = true
        is_clicked = false
    })

    // room.addEventListener('mouseleave', () => {
    //     cursor.remove()
    //     is_clicked = false
    // })

    // document.getElementById('rotate_button').addEventListener('click', () => {
    //     cursor.remove()
    //     is_left ? is_left = false : is_left = true
    //     is_clicked = false
    // })

    // const html = document.getElementsByTagName('html')[0]

    // let cur_element = room
    // while(true) {
    //     if(cur_element == html)
    //         break

    //     let style = window.getComputedStyle(cur_element)
    //     gap_left = gap_left + parseInt(style.marginLeft.slice(0, -2)) + parseInt(style.paddingLeft.slice(0, -2))
    //     gap_top = gap_top+ parseInt(style.marginTop.slice(0, -2)) + parseInt(style.paddingTop.slice(0, -2))
    //     cur_element = cur_element.parentElement
    // }

}