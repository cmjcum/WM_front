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


async function handleSignup() {
    const contentData = {
        content: document.getElementById('contentId').value,
    }
    // 가져온 데이터를 fetch를 사용해 해당 url의 headers 에 json 방식으로 넘겨운다.
    const response = await fetch(`${backend_base_url}/user/<int:owner_id>`, {
        headers: {
            // 어떤 type으로 데이터를 보내줄지 선택한다.
            Accept: "application/json",
            'Content-type': 'application/json'
        },
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
        window.location.reload();
    } else {
        alert('다시 작성해 주세요')
    }
}



{/* <input type="submit" id="login" class="button margin-top-40" value="Sign In" onclick="handleSignin()"></input> */}