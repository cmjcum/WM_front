const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"


function guestbookModal() {
    const open = () => {
        document.querySelector(".modal").classList.remove("hidden");
    }

    const close = () => {
        document.querySelector(".modal").classList.add("hidden");
    }
    document.querySelector(".openBtn").addEventListener("click", open);
    document.querySelector(".closeBtn").addEventListener("click", close);
    document.querySelector(".bg").addEventListener("click", close);
}


async function modalData() {
    const contentData = {
        content: document.getElementById('guestBookData').value,
    }
    // <owner_id>
    // 가져온 데이터를 fetch를 사용해 해당 url의 headers 에 json 방식으로 넘겨운다.
    const response = await fetch(`${backend_base_url}/myroom/user/1/`, {
        headers: {
            // 어떤 type으로 데이터를 보내줄지 선택한다.
            Authorization: 'Bearer ' + localStorage.getItem('access'),
            'Content-type': 'application/json',
            Accept: "application/json",
        },
        withCredentials: true,
        method: 'POST',
        //  body 에는 프론트에서 가져온 signupData 를
        // stringify 를 사용해 자바스크립트의 값을 JSON 문자열로 변환한다.
        body: JSON.stringify(contentData)
    }
    )
    // response 한 데이터 또한 json 화 해주어야 한다. url에 await 걸어준것 처럼 await 를 걸어준다.
    response_json = await response.json()

    if (response.status == 200) {
        alert('방명록이 작성됬습니다.')
    } else {
        alert('다시 작성해 주세요')
    }
}


// async function roomData() {
//     const a = {
//     }
  
//     const response = await fetch(`${backend_base_url}/myroom/user/1/`, {
//       method: 'GET',
//       headers: '',
//       body: JSON.stringify(a)
//     })
//     response_json = await response.json()
// }