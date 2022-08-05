function linkify(inputText) {
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}


async function postArticle() {
    let board_id = searchParam('board');

    $("#alert").empty()

    const formdata = new FormData();

    const title = document.getElementById("inputTitle").value
    const content = document.getElementById("inputContent").value
    const image = document.getElementById("inputFile").files[0]
    
    if ($('#inputTitle').val() == "" | $('#inputContent').val() == "") {
        alert_temp = `<div class="alert alert-dismissible alert-secondary">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <p class="mb-0">제목과 내용은 비워둘 수 없어요!</p>
        </div>`
        $("#alert").append(alert_temp)
        return;
    }

    let fileForm = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
    if (!$('#inputFile').val().match(fileForm)) {
        alert_temp = `<div class="alert alert-dismissible alert-secondary">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <p class="mb-0">이미지 파일이 아니에요!</p>
        </div>`
        $("#alert").append(alert_temp)
        return;
    }
    
    let maxSize = 5 * 1024 * 1024;
    let fileSize = image.size;
    if (fileSize >= maxSize) {
        alert_temp = `<div class="alert alert-dismissible alert-secondary">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <p class="mb-0">파일의 용량이 5MB보다 커요!</p>
        </div>`
        $("#alert").append(alert_temp)
        return;
    }
    
    if ($('#inputFile').val() == "") {
        formdata.append('title', title)
        formdata.append('content', content)
    } else {
            formdata.append('title', title)
            formdata.append('content', content)
            formdata.append('pic', image)
    }

        const response = await fetch(`${backend_base_url}/board/${board_id}/post/`, {
            method: 'POST',
            headers: { Authorization: "Bearer " + localStorage.getItem("access"), },
            body: formdata
        })

        if (response.status == 200) {
            window.location.replace(`${frontend_base_url}/board/board.html?board=${board_id}&page=1`);
        } else {
            alert_temp = `<div class="alert alert-dismissible alert-secondary">
                                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                                            <p class="mb-0">게시글 작성에 실패했어요!</p>
                                        </div>`
            $("#alert").append(alert_temp)
        }
    }



function editButtonClick() {
    let edit_link = window.location.search.split('?')[1]
    window.location.replace(`${frontend_base_url}/board/article_edit.html?${edit_link}`);
}


async function loadArticleData() {
    let board_id = searchParam('board');
    let article_id = searchParam('article');

    const response = await fetch(`${backend_base_url}/board/${board_id}/editor/${article_id}/`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {

            document.getElementById("inputTitle").setAttribute('value', data.title)
            document.getElementById("inputContent").innerHTML = data.content

        })
}


async function putArticle() {
    let board_id = searchParam('board');
    let article_id = searchParam('article');

    const title = document.getElementById("inputTitle").value
    const content = document.getElementById("inputContent").value

    const formdata = new FormData();

    formdata.append('title', title)
    formdata.append('content', content)

    const response = await fetch(`${backend_base_url}/board/${board_id}/edit/${article_id}/`, {
        method: 'PUT',
        headers: { Authorization: "Bearer " + localStorage.getItem("access"), },
        body: formdata
    })

    if (response.status == 200) {
        window.location.replace(`${frontend_base_url}/board/article.html?board=${board_id}&article=${article_id}`);
    } else {
        alert("작성 실패")
    }
}


async function deleteArticle() {
    let board_id = searchParam('board');
    let article_id = searchParam('article');
    const response = await fetch(`${backend_base_url}/board/${board_id}/del/${article_id}/`, {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
        },
    })

    if (response.status == 200) {
        alert('삭제 되었습니다.')
        window.location.replace(`${frontend_base_url}/board/board.html?board=${board_id}&page=1`);
    } else {
        alert('권한이 없습니다.')
    }
}


async function loadArticle() {
    let board_id = searchParam('board');
    let article_id = searchParam('article');
    let current_page = searchParam('page');

    const response = await fetch(`${backend_base_url}/board/${board_id}/${article_id}/`, {
        method: 'GET',
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access")
        },
        withCredentials: true,
    })
        .then(response => response.json())
        .then(data => {

            if (Object.keys(data) == "detail") {
                window.location.replace(`${frontend_base_url}/board/error.html`);

            } else {
                let content = linkify(data.content)
                let change_content = content.replace(/(\n|\r\n)/g, '<br>')

                $("#articleTitle").append(data.title)
                $("#articleAuthor").append(data.author_name)
                $("#articleContent").append(change_content)
                $("#articleDate").append(data.create_date)
                $("#commentCount").append(data.comments_cnt)
                $("#likeCount").append(data.likes_cnt)

                if (data.liked_this) {
                    temp = `<span class="fs-6"><a class="text-primary no-deco" onclick="undoLike()" style="cursor:pointer"><i  class="bi bi-hand-thumbs-up-fill  me-1"></i>좋아요!</a></span>`
                } else {
                    temp = `<span class="fs-6"><a class="text-primary  no-deco" onclick="doLike()" style="cursor:pointer"><i  class="bi bi-hand-thumbs-up  me-1"></i>좋아요</a></span>`
                }
                $("#articleLikeBtn").append(temp)
                let btn_temp = `<div class="position-absolute top-0 end-0 mt-3 me-3">
                                                <a href="${frontend_base_url}/board/board.html?board=${board_id}&page=1" class="text-primary">
                                                    목록으로 돌아가기 <i class="bi bi-arrow-counterclockwise"></i>
                                                </a>
                                            </div>`
                $("#goToList").append(btn_temp)

                if (data.moved) {
                    author_link_temp = `<a href="/myroom/myroom.html?user=${data.author}" class="text-secondary"><i class="bi bi-house-fill"></i></a>`
                    $("#articleAuthorLink").append(author_link_temp)
                }

                if (data.picture_url) {
                    let pic_temp = `<figure>
                                                <img src="${data.picture_url}">
                                            </figure>`
                    $("#articlePic").append(pic_temp)
                }

                const login_user = JSON.parse(localStorage.getItem("payload")).user_id
                const author_id = data.author

                if (login_user == author_id) {
                    let edit_btn_temp = `
                        <span class="text-secondary fs-6 me-2">이 게시글을</span>
                        <button type="button" class="btn btn-secondary btn-sm me-2" onclick="editButtonClick()">수정</button>
                        <button type="button" class="btn btn-dark btn-sm" onclick="deleteArticle()">삭제</button>`
                    $("#authorEditBtn").append(edit_btn_temp)
                }

                for (let i = 0; i < data['comments'].length; i++) {
                    let parent_comment = data['comments'][i]
                    let change_content = parent_comment.content.replace(/(\n|\r\n)/g, '<br>')

                    if (login_user == parent_comment.author) {

                        if (parent_comment.moved) {
                            comment_temp = `
                            <div class="card text-white bg-dark my-2">
                                    <div class="card-header d-flex justify-content-between mb-0">
                                        <h5 id="commentHeader-${parent_comment.id}" class="text-secondary">${parent_comment.author_name}
                                            <a href="/myroom/myroom.html?user=${parent_comment.author}" class="text-secondary"><i class="bi bi-house-fill"></i></a>
                                            <span id="date" class="text-primary text-end fs-6 ms-4">${parent_comment.create_date}</span>
                                        </h5>
                                        <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="collapse"
                                            data-bs-target="#reply-${parent_comment.id}" aria-expanded="false"><i
                                            class="bi bi-reply-fill me-1"></i>댓글</button>
                                            </div>
                                    <!-- 가변 (보기모드) -->
                                    <div class="collapse multi-collapse-${parent_comment.id} show" id="comment-${parent_comment.id}">
                                        <div class="card-body pt-0">
                                            <p class="card-text fs-6">${change_content}</p>
                                        </div>
                                        <div class="card-footer d-flex justify-content-end">
                                            <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="collapse"
                                                data-bs-target=".multi-collapse-${parent_comment.id}" aria-expanded="false">수정</button>
                                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="deleteComment(this)">삭제</button>
                                        </div>
                                    </div>
                                    <!-- 가변 (수정모드) -->
                                    <div class="collapse multi-collapse-${parent_comment.id}" id="commentEdit-${parent_comment.id}">
                                        <div class="card-body pt-0">
                                            <textarea class="form-control" id="commentForm-${parent_comment.id}" rows="3">${parent_comment.content}</textarea>
                                        </div>
                                        <div class="card-footer d-flex justify-content-end">
                                            <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="collapse"
                                                data-bs-target=".multi-collapse-${parent_comment.id}" aria-expanded="false">취소</button>
                                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="editComment(this)">수정 완료</button>
                                        </div>
                                    </div>
                                    <!-- 대댓글 작성폼 -->
                                    <div class="collapse" id="reply-${parent_comment.id}">
                                        <div class="card-body pt-0">
                                            <div class="form-group my-3">
                                            <textarea class="form-control" id="replyForm-${parent_comment.id}" rows="3"></textarea>
                                            <div class="d-flex justify-content-end mt-2">
                                                <input type="text" class="visually-hidden" value="${parent_comment.id}">
                                                <button type="button" class="btn btn-secondary" onclick="postReply(this)">댓글 남기기</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="replyBox-${parent_comment.id}"></div>
                                </div>
                                `
                        } else {
                            comment_temp = `
                                <div class="card text-white bg-dark my-2">
                                        <div class="card-header d-flex justify-content-between mb-0">
                                            <h5 id="commentHeader-${parent_comment.id}" class="text-secondary">${parent_comment.author_name}
                                                <span id="date" class="text-primary text-end fs-6 ms-4">${parent_comment.create_date}</span>
                                            </h5>
                                            <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="collapse"
                                                data-bs-target="#reply-${parent_comment.id}" aria-expanded="false"><i
                                                class="bi bi-reply-fill me-1"></i>댓글</button>
                                                </div>
                                        <!-- 가변 (보기모드) -->
                                        <div class="collapse multi-collapse-${parent_comment.id} show" id="comment-${parent_comment.id}">
                                            <div class="card-body pt-0">
                                                <p class="card-text fs-6">${change_content}</p>
                                            </div>
                                            <div class="card-footer d-flex justify-content-end">
                                                <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="collapse"
                                                    data-bs-target=".multi-collapse-${parent_comment.id}" aria-expanded="false">수정</button>
                                                <button type="button" class="btn btn-outline-primary btn-sm" onclick="deleteComment(this)">삭제</button>
                                            </div>
                                        </div>
                                        <!-- 가변 (수정모드) -->
                                        <div class="collapse multi-collapse-${parent_comment.id}" id="commentEdit-${parent_comment.id}">
                                            <div class="card-body pt-0">
                                                <textarea class="form-control" id="commentForm-${parent_comment.id}" rows="3">${parent_comment.content}</textarea>
                                            </div>
                                            <div class="card-footer d-flex justify-content-end">
                                                <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="collapse"
                                                    data-bs-target=".multi-collapse-${parent_comment.id}" aria-expanded="false">취소</button>
                                                <button type="button" class="btn btn-outline-primary btn-sm" onclick="editComment(this)">수정 완료</button>
                                            </div>
                                        </div>
                                        <!-- 대댓글 작성폼 -->
                                        <div class="collapse" id="reply-${parent_comment.id}">
                                            <div class="card-body pt-0">
                                                <div class="form-group my-3">
                                                <textarea class="form-control" id="replyForm-${parent_comment.id}" rows="3"></textarea>
                                                <div class="d-flex justify-content-end mt-2">
                                                    <input type="text" class="visually-hidden" value="${parent_comment.id}">
                                                    <button type="button" class="btn btn-secondary" onclick="postReply(this)">댓글 남기기</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="replyBox-${parent_comment.id}"></div>
                                    </div>
                                    `
                        }

                    } else {
                        if (parent_comment.moved) {
                            comment_temp = `
                                    <div class="card text-white bg-dark my-2">
                                        <div class="card-header d-flex justify-content-between mb-0">
                                            <h5 id="commentAuthor-${parent_comment.id}" class="text-secondary">${parent_comment.author_name}
                                                <a href="/myroom/myroom.html?user=${parent_comment.author}" class="text-secondary"><i class="bi bi-house-fill"></i></a>
                                                <span id="date" class="text-primary text-end fs-6 ms-4">${parent_comment.create_date}</span>
                                            </h5>
                                            <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="collapse"
                                                    data-bs-target="#reply-${parent_comment.id}" aria-expanded="false"><i
                                                    class="bi bi-reply-fill me-1"></i>댓글</button>
                                        </div>
                                        <div class="card-body pt-0">
                                            <p class="card-text fs-6">${change_content}</p>
                                        </div>
        
                                        <!-- 대댓글 작성폼 -->
                                        <div class="collapse" id="reply-${parent_comment.id}">
                                            <div class="card-body pt-0">
                                                <div class="form-group my-3">
                                                    <textarea class="form-control" id="replyForm-${parent_comment.id}" rows="3"></textarea>
                                                    <div class="d-flex justify-content-end mt-2">
                                                        <input type="text" class="visually-hidden" value="${parent_comment.id}">
                                                        <button type="button" class="btn btn-secondary" onclick="postReply(this)">댓글 남기기</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="replyBox-${parent_comment.id}"></div>
                                    </div>`
                        } else {
                            comment_temp = `
                                            <div class="card text-white bg-dark my-2">
                                                <div class="card-header d-flex justify-content-between mb-0">
                                                    <h5 id="commentAuthor-${parent_comment.id}" class="text-secondary">${parent_comment.author_name}
                                                        <span id="date" class="text-primary text-end fs-6 ms-4">${parent_comment.create_date}</span>
                                                    </h5>
                                                    <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="collapse"
                                                            data-bs-target="#reply-${parent_comment.id}" aria-expanded="false"><i
                                                            class="bi bi-reply-fill me-1"></i>댓글</button>
                                                </div>
                                                <div class="card-body pt-0">
                                                    <p class="card-text fs-6">${change_content}</p>
                                                </div>
                
                                                <!-- 대댓글 작성폼 -->
                                                <div class="collapse" id="reply-${parent_comment.id}">
                                                    <div class="card-body pt-0">
                                                        <div class="form-group my-3">
                                                            <textarea class="form-control" id="replyForm-${parent_comment.id}" rows="3"></textarea>
                                                            <div class="d-flex justify-content-end mt-2">
                                                                <input type="text" class="visually-hidden" value="${parent_comment.id}">
                                                                <button type="button" class="btn btn-secondary" onclick="postReply(this)">댓글 남기기</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div id="replyBox-${parent_comment.id}"></div>
                                            </div>`
                        }
                    }
                    $("#commentList").append(comment_temp)
                    let replyBox = `replyBox-${parent_comment.id}`

                    if (parent_comment.reply_cnt) {

                        for (let i = 0; i < parent_comment.reply_cnt; i++) {
                            let reply = parent_comment.reply[i]
                            let text = linkify(reply.content)
                            let change_content = text.replace(/(\n|\r\n)/g, '<br>')

                            if (login_user == reply.author) {
                                if (reply.moved) {
                                    reply_temp = `
                                                <div class="card text-white bg-dark reply">
                                                    <div class="card-header d-flex justify-content-between mb-0">
                                                        <h5 id="commentAuthor-${reply.id}" class="text-secondary">${reply.author_name}
                                                            <a href="/myroom/myroom.html?user=${reply.author}" class="text-secondary"><i class="bi bi-house-fill"></i></a>
                                                            <span id="date" class="text-primary text-end fs-6 ms-4">${reply.create_date}</span>
                                                        </h5>
        
                                                    </div>
                                                    <!-- 가변 (보기모드) -->
                                                    <div class="collapse multi-collapse-${reply.id} show">
                                                        <div class="card-body pt-0">
                                                            <p class="card-text fs-6">
                                                            ${change_content}
                                                            </p>
                                                        </div>
                                                    <div class="card-footer d-flex justify-content-end">
                                                        <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="collapse"
                                                            data-bs-target=".multi-collapse-${reply.id}" aria-expanded="false">수정</button>
                                                        <button type="button" class="btn btn-outline-primary btn-sm"  onclick="deleteComment(this)">삭제</button>
                                                    </div>
                                                    </div>
                                                    <!-- 가변 (수정모드) -->
                                                    <div class="collapse multi-collapse-${reply.id}" id="commentEdit-${reply.id}">
                                                        <div class="card-body pt-0">
                                                            <input type="text" class="visually-hidden" id="reply-${reply.id}" value="${parent_comment.id}">
                                                            <textarea class="form-control" id="commentForm-${reply.id}" rows="3">${reply.content}</textarea>
                                                        </div>
                                                        <div class="card-footer d-flex justify-content-end">
                                                            <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="collapse"
                                                                data-bs-target=".multi-collapse-${reply.id}" aria-expanded="false">취소</button>
                                                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="editComment(this)">수정 완료</button>
                                                        </div>
                                                    </div>`
                                } else {
                                    reply_temp = `
                                                <div class="card text-white bg-dark reply">
                                                    <div class="card-header d-flex justify-content-between mb-0">
                                                        <h5 id="commentAuthor-${reply.id}" class="text-secondary">${reply.author_name}
                                                            <span id="date" class="text-primary text-end fs-6 ms-4">${reply.create_date}</span>
                                                        </h5>
        
                                                    </div>
                                                    <!-- 가변 (보기모드) -->
                                                    <div class="collapse multi-collapse-${reply.id} show">
                                                        <div class="card-body pt-0">
                                                            <p class="card-text fs-6">
                                                            ${change_content}
                                                            </p>
                                                        </div>
                                                    <div class="card-footer d-flex justify-content-end">
                                                        <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="collapse"
                                                            data-bs-target=".multi-collapse-${reply.id}" aria-expanded="false">수정</button>
                                                        <button type="button" class="btn btn-outline-primary btn-sm"  onclick="deleteComment(this)">삭제</button>
                                                    </div>
                                                    </div>
                                                    <!-- 가변 (수정모드) -->
                                                    <div class="collapse multi-collapse-${reply.id}" id="commentEdit-${reply.id}">
                                                        <div class="card-body pt-0">
                                                            <input type="text" class="visually-hidden" id="reply-${reply.id}" value="${parent_comment.id}">
                                                            <textarea class="form-control" id="commentForm-${reply.id}" rows="3">${reply.content}</textarea>
                                                        </div>
                                                        <div class="card-footer d-flex justify-content-end">
                                                            <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="collapse"
                                                                data-bs-target=".multi-collapse-${reply.id}" aria-expanded="false">취소</button>
                                                            <button type="button" class="btn btn-outline-primary btn-sm" onclick="editComment(this)">수정 완료</button>
                                                        </div>
                                                    </div>`
                                }
                            } else {
                                if (reply.moved) {
                                    reply_temp = `
                                            <div class="card text-white bg-dark reply">
                                                    <div class="card-header d-flex justify-content-between mb-0">
                                                        <h5 id="commentAuthor-${reply.id}" class="text-secondary">${reply.author_name}
                                                            <a href="/myroom/myroom.html?user=${reply.author}" class="text-secondary"><i class="bi bi-house-fill"></i></a>
                                                            <span id="date" class="text-primary text-end fs-6 ms-4">${reply.create_date}</span>
                                                        </h5>
        
                                                    </div>
                                                    <!-- 가변 (보기모드) -->
                                                    <div class="collapse multi-collapse-${reply.id} show">
                                                        <div class="card-body pt-0">
                                                            <p class="card-text fs-6">
                                                            ${change_content}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>`
                                } else {
                                    reply_temp = `
                                                        <div class="card text-white bg-dark reply">
                                                                <div class="card-header d-flex justify-content-between mb-0">
                                                                    <h5 id="commentAuthor-${reply.id}" class="text-secondary">${reply.author_name}
                                                                        <span id="date" class="text-primary text-end fs-6 ms-4">${reply.create_date}</span>
                                                                    </h5>
                    
                                                                </div>
                                                                <!-- 가변 (보기모드) -->
                                                                <div class="collapse multi-collapse-${reply.id} show">
                                                                    <div class="card-body pt-0">
                                                                        <p class="card-text fs-6">
                                                                        ${change_content}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>`
                                }
                            }
                            $(`#${replyBox}`).append(reply_temp)
                        }
                    }

                }

            }

        })
}


async function doLike() {
    let article_id = searchParam('article');

    const response = await fetch(`${backend_base_url}/board/like/${article_id}/`, {
        method: 'POST',
        headers: { Authorization: "Bearer " + localStorage.getItem("access"), },
    })

    if (response.status == 200) {
        window.location.reload(true);
    } else {
        alert(response.status)
    }
}


async function undoLike() {
    let article_id = searchParam('article');

    const response = await fetch(`${backend_base_url}/board/like/${article_id}/`, {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
        },
    })

    if (response.status == 200) {
        window.location.reload(true);
    } else {
        alert(response.status)
    }
}
