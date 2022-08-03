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


async function postReply(obj) {
    let board_id = searchParam('board');
    let article_id = searchParam('article');
    let parent_comment_id = $(obj).prev().attr('value');
    let form_id = `replyForm-${parent_comment_id}`

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


async function editComment(obj) {
    let board_id = searchParam('board');
    let article_id = searchParam('article');
    let comment_id = $(obj).prev().attr('data-bs-target').split('-')[2];

    let form_id = `commentForm-${comment_id}`

    const content = document.getElementById(form_id).value

    
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
    } else {
        alert('권한이 없습니다.')
    }
}


async function deleteComment(obj) {
    let board_id = searchParam('board');
    let article_id = searchParam('article');
    let comment_id = $(obj).prev().attr('data-bs-target').split('-')[2];

    const response = await fetch(`${backend_base_url}/board/${board_id}/${article_id}/del/${comment_id}/`, {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('access'),
        },
    })

    if (response.status == 200) {
        alert('삭제 되었습니다.')
        window.location.reload(true);
    } else {
        alert('권한이 없습니다.')
    }
}