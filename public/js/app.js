let socket = io();

let username;

const textarea = document.querySelector('#textarea');
const submitBtn = document.querySelector('#submitBtn');
const commentBox = document.querySelector('.comment_Box');
do {
    username = prompt("Enter your name");
} while (!username)

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let comment = textarea.value;

    if (!comment) return

    postComment(comment)
})

function postComment(comment) {
    //Append to dom
    let data = {
        username: username,
        comment: comment
    }

    appendToDom(data);
    textarea.value = '';

    //Boardcast
    boardCastComment(data);

    //Sync with Mongodb
    syncWithDb(data);
}

function appendToDom(data) {


    let lTag = document.createElement('li');
    lTag.classList.add('comment', 'mb-3');

    let markup = ` 
    <div class="card border-light mb-3">
        <div class="card-body">
            <h6>${data.username}</h6>
            <p>${data.comment}</p>
             <div>
                <img src="/img/clock.png" alt="clock">
                <small>${moment(data.time).format('LT')}</small>
            </div>
        </div>
    </div>
`
    lTag.innerHTML = markup
    commentBox.prepend(lTag)
}

function boardCastComment(data) {

    socket.emit('comment', data);
}

//from server
socket.on('comment', (data) => {
    appendToDom(data);
})

const typing = document.querySelector('#typing');

textarea.addEventListener('keyup', () => {
    socket.emit('typing', { username })
})

//debouning function to clear the typing innerText
let timerId = null;

function deBounce(func, timer) {
    if (timerId) {
        clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
        func()
    }, timer)
};
socket.on('typing', (data) => {
    typing.innerText = `${data.username} is typing....`;

    deBounce(function () {
        typing.innerText = '';
    }, 1000);

});


//Api calls

function syncWithDb(data) {

    //setting headers because to let the server knwo what type of data we are sending
    const headers = {
        'Content-Type': 'application/json'
    }

    fetch('/api/comments', { method: 'Post', body: JSON.stringify(data), headers })
        .then(response => response.json())
        .then(result => {
            console.log(result);
        })
}

//for getting comments from database.make sure mongodb service is running

function fetchComments() {
    
    fetch('/api/comments')
        .then(res => res.json())
        .then(result => {
            result.forEach((comment) => {
                comment.time = comment.createdAt;
                appendToDom(comment);
            })
        })
}

window.onload = fetchComments