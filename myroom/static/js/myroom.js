function guestbookModal() {
    console.log("aa");
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


// 회원가입 코드 //////////////////////////////////
// async function handleSignup() {
//     const signupData = {
//         // getElementById 를 사용해 fullname, username, password 데이터를 가져온다.
//         fullname: document.getElementById('floatingInputFullname').value,
//         username: document.getElementById("floatingInput").value,
//         password: document.getElementById('floatingPassword').value,
//     }
//     // 가져온 데이터를 fetch를 사용해 해당 url의 headers 에 json 방식으로 넘겨운다.
//     const response = await fetch(`${backend_base_url}/user/`, {
//         headers: {
//             // 어떤 type으로 데이터를 보내줄지 선택한다.
//             Accept: "application/json",
//             'Content-type': 'application/json'
//         },
//         method: 'POST',
//         //  body 에는 프론트에서 가져온 signupData 를
//         // stringify 를 사용해 자바스크립트의 값을 JSON 문자열로 변환한다.
//         body: JSON.stringify(signupData)
//     }
//     )
//     // response 한 데이터 또한 json 화 해주어야 한다. url에 await 걸어준것 처럼 await 를 걸어준다.
//     response_json = await response.json()

//     if (response.status == 200) {
//         alert('회원 가입 성공')
//         window.location.reload();
//     } else {
//         alert('다시 입력해 주세요')
//     }
// }