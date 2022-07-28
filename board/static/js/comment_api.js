// url matching
// const backend_base_url = "http://127.0.0.1:8000"
// const frontend_base_url = "http://127.0.0.1:5500"

// method POST
// 댓글 작성하기
async function postComment() {
    let board_id = searchParam('board');
    let article_id = searchParam('article');

    const content = document.getElementById("commentForm").value

    const formdata = new FormData();
    formdata.append('content', content)

    const response = await fetch(`${backend_base_url}/board/${board_id}/${article_id}/post/`, {
        method: 'POST',
        headers: { Authorization: "Bearer " + localStorage.getItem("access"), },
        body: formdata
    })

    if (response.status == 200) {
        window.location.reload(true);
    } else {
        alert(response.status)
    }
}

// 대댓글 작성하기
async function postReply(obj) {
    let board_id = searchParam('board');
    let article_id = searchParam('article');
    let parent_comment_id = $(obj).prev().attr('value');
    let form_id = `replyForm-${parent_comment_id}`

    // console.log("reply post start", board_id, article_id, parent_comment_id)

    const content = document.getElementById(form_id).value

    const contentData = {
        content: content,
        parent: parent_comment_id,
    }

    const response = await fetch(`${backend_base_url}/board/${board_id}/${article_id}/post/`, {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
            Accept: "application/json",
            'Content-type': 'application/json',
        },
        withCredentials: true,
        body: JSON.stringify(contentData)
    }
    )
    response_json = await response.json()

    if (response.status == 200) {
        window.location.reload(true);

    } else {
        alert(response.status)
    }
}

// method PUT
// 댓글 수정하기
async function editComment(obj) {
    let board_id = searchParam('board');
    let article_id = searchParam('article');
    let comment_id = $(obj).prev().attr('data-bs-target').split('-')[2];
    // let parent_comment_id = $(obj).prev().attr('value');
    let form_id = `commentForm-${comment_id}`

    const content = document.getElementById(form_id).value
    // console.log("comment_id: ", comment_id)
    // console.log("content: ", content)
    
    const contentData = {
        content: content,
    }

    const response = await fetch(`${backend_base_url}/board/${board_id}/${article_id}/edit/${comment_id}/`, {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
            Accept: "application/json",
            'Content-type': 'application/json',
        },
        withCredentials: true,
        body: JSON.stringify(contentData)
    }
    )
    response_json = await response.json()

    if (response.status == 200) {
        window.location.reload(true);
        // window.location.replace(`${frontend_base_url}/board/article.html?board=${board_id}&article=${article_id}`);
    } else {
        alert('권한이 없습니다.')
    }
}


// method DELETE
// 댓글 삭제하기
async function deleteComment(obj) {
    let board_id = searchParam('board');
    let article_id = searchParam('article');
    let comment_id = $(obj).prev().attr('data-bs-target').split('-')[2];

    // console.log("comment_id: ", comment_id)

    const response = await fetch(`${backend_base_url}/board/${board_id}/${article_id}/del/${comment_id}/`, {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
        },
    })

    if (response.status == 200) {
        alert('삭제 되었습니다.')
        window.location.reload(true);
        // window.location.replace(`${frontend_base_url}/board/article.html?board=${board_id}&article=${article_id}`);
    } else {
        alert('권한이 없습니다.')
    }
}