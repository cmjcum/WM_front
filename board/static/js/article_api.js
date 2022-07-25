// url matching
// const backend_base_url = "http://127.0.0.1:8000"
// const frontend_base_url = "http://127.0.0.1:5500"

// method GET
// 게시글 상세 페이지
async function loadArticle() {
    let board_id = window.location.search.split('board=')[1].split('?')[0]
    let article_id = window.location.search.split('article=')[1]
    console.log("load article", board_id, article_id)

    const response = await fetch(`${backend_base_url}/board/${board_id}/${article_id}/`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {
            // Object {
            //      id: 27, 
            //      planet: 8, 
            //      author: 3, title: "테스트!!!!!", 
            //      content: "댓글 달아볼 거예용~~~", 
            //      picture_url: "", 
            //      create_date: "22.07.19 04:21:06", 
            //      comments: [] }
            console.log(data)
            author_link_temp = `<a href="/myroom/myroom.html?user=${data.author_id}" class="text-secondary"><i class="bi bi-house-fill"></i></a>`
            $("#articleTitle").append(data.title)
            $("#articleAuthor").append(data.author)
            $("#articleAuthorLink").append(author_link_temp)
            $("#articleContent").append(data.content)
            $("#articleDate").append(data.create_date)
            if (data.picture_url != null) {
                pic_temp = `<figure>
                                            <img src="${data.picture_url}">
                                        </figure>`
                $("#articlePic").append(pic_temp)
            }

            // 게시글 작성자인가? > 맞으면 수정/삭제 버튼 출력
            // 이미지가 있는가? > 없으면 이미지 영역 출력x
            // 댓글이 있는가? > 없으면 댓글 영역 출력x

        })
}

// method POST
// 게시글 작성하기

// method PUT
// 게시글 수정하기

// method DELETE
// 게시글 삭제하기