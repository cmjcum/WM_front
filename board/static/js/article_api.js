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

            console.log(data)

            // var text = document.querySelector('textarea');
            // var result = text.value.replace(/(\n|\r\n)/g, '<br>');

            change_content = data.content.replace(/(\n|\r\n)/g, '<br>')
            author_link_temp = `<a href="/myroom/myroom.html?user=${data.author_id}" class="text-secondary"><i class="bi bi-house-fill"></i></a>`
            $("#articleTitle").append(data.title)
            $("#articleAuthor").append(data.author)
            $("#articleAuthorLink").append(author_link_temp)
            $("#articleContent").append(change_content)
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

            //             Object { id: 1, article: "사진있 댓글있 테스트!!!!!!!!!", parent: null, author: "세계지도", author_id: 3, content: "댓글 달아보기~~", create_date: "22.07.19 01:24:41", reply: (4) […] }
            // ​
            // article: "사진있 댓글있 테스트!!!!!!!!!"
            // ​
            // author: "세계지도"
            // ​
            // author_id: 3
            // ​
            // content: "댓글 달아보기~~"
            // ​
            // create_date: "22.07.19 01:24:41"
            // ​
            // id: 1
            // ​
            // parent: null
            // ​
            // reply: Array(4) [ {…}, {…}, {…}, … ]


            console.log(data['comments'].length)
            for (let i = 0; i < data['comments'].length; i++) {
                console.log(data['comments'][i])
                parent_comment = data['comments'][i]
                // 수정 버튼 작용 
                // <div class="collapse multi-collapse-${parent_comment.id} show" ...>
                // (data-bs-target=".multi-collapse-${parent_comment.id}")

                // 대댓글 작성창
                // <div class="collapse" id="reply-${parent_comment.id}">
                // (data-bs-target="#reply-${parent_comment.id}")
                comment_temp = `
            <div class="card text-white bg-dark my-2">
                    <div class="card-header d-flex justify-content-between mb-0">
                        <h5 id="commentAuthor-${parent_comment.id}" class="text-secondary">${parent_comment.author}
                            <a href="/myroom/myroom.html?user=${parent_comment.author_id}" class="text-secondary"><i class="bi bi-house-fill"></i></a>
                            <span id="date" class="text-primary text-end fs-6 ms-4">${parent_comment.create_date}</span>
                        </h5>
                        <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="collapse"
                            data-bs-target="#reply-${parent_comment.id}" aria-expanded="false"><i
                                class="bi bi-reply-fill me-1"></i>댓글</button>
                    </div>
                    <!-- 가변 (보기모드) -->
                    <div class="collapse multi-collapse-${parent_comment.id} show" id="comment-${parent_comment.id}">
                        <div class="card-body pt-0">
                            <p class="card-text fs-6">${parent_comment.content}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-end">
                            <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="collapse"
                                data-bs-target=".multi-collapse-${parent_comment.id}" aria-expanded="false">수정</button>
                            <button type="button" class="btn btn-outline-primary btn-sm">삭제</button>
                        </div>
                    </div>
                    <!-- 가변 (수정모드) -->
                    <div class="collapse multi-collapse-${parent_comment.id}" id="commentEdit-${parent_comment.id}">
                        <div class="card-body pt-0">
                            <textarea class="form-control" id="comment-form" rows="3">${parent_comment.content}</textarea>
                        </div>
                        <div class="card-footer d-flex justify-content-end">
                            <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="collapse"
                                data-bs-target=".multi-collapse-${parent_comment.id}" aria-expanded="false">취소</button>
                            <button type="button" class="btn btn-outline-primary btn-sm">수정 완료</button>
                        </div>
                    </div>
                    <!-- 대댓글 작성폼 -->
                    <div class="collapse" id="reply-${parent_comment.id}">
                        <div class="card-body pt-0">
                            <div class="form-group my-3">
                                <textarea class="form-control" id="replyForm" rows="3"></textarea>
                                <div class="d-flex justify-content-end mt-2">
                                    <button type="button" class="btn btn-secondary">댓글 남기기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
                $("#commentList").append(comment_temp)

                comment_temp = `<div class="card text-white bg-dark my-2">
                <div class="card-header d-flex justify-content-between mb-0">
                    <h5 id="commentAuthor-${parent_comment.id}" class="text-secondary">${parent_comment.author}
                        <a href="/myroom/myroom.html?user=${parent_comment.author_id}" class="text-secondary"><i class="bi bi-house-fill"></i></a>
                        <span id="date" class="text-primary text-end fs-6 ms-4">${parent_comment.create_date}</span>
                    </h5>
                </div>
                <div class="card-body pt-0">
                    <p class="card-text fs-6">${parent_comment.content}</p>
                </div>
                <!-- 대댓글 작성폼 -->
                    <div class="collapse" id="reply-${parent_comment.id}">
                        <div class="card-body pt-0">
                            <div class="form-group my-3">
                                <textarea class="form-control" id="replyForm" rows="3"></textarea>
                                <div class="d-flex justify-content-end mt-2">
                                    <button type="button" class="btn btn-secondary">댓글 남기기</button>
                                </div>
                            </div>
                        </div>
            </div>
                `

                // for(let j = 0; j < parent_comment['reply'].length; j++) {
                //     console.log(parent_comment['reply'][j])
                // }
            }



        })
}

// method POST
// 게시글 작성하기
async function postArticle() {
    const title = document.getElementById("article_title").value
    const content = document.getElementById("article_content").value
    const image = document.getElementById("article_image").files[0]

    const formdata = new FormData();

    formdata.append('title', title)
    formdata.append('content', content)
    formdata.append('image', image)



    const response = await fetch(`${backend_base_url}/articles/`, {
        method: 'POST',
        body: formdata
    }
    )



    if (response.status == 200) {
        alert("글작성 완료!")
        window.location.replace(`${frontend_base_url}/`);
    } else {
        alert(response.status)
    }


}

// method PUT
// 게시글 수정하기

// method DELETE
// 게시글 삭제하기