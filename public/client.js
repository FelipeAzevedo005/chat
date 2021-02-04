const socket = io('http://localhost:3000');

// login
const login = document.querySelector('#login');

login.addEventListener('submit', event => {
    event.preventDefault();

    const nickname = event.target.nickname.value;

    socket.nickname = nickname;
    
    login.classList.add('hide');
});

const chat = document.getElementById('chat');

chat.addEventListener('submit', event => {
    event.preventDefault();
    
    const message = event.target.message.value;
    sendMessage(socket.nickname, message);
});

const sendMessage = (nickname, message) => {
    if (message !== '')  {
        const data = { id: socket.id, nickname, message, messageSide: 'right' };
        socket.emit('newMessage', data);
        renderMessage(data);
        event.target.message.value = '';
    }
};
  
const newElement = (tagName, className) => {
    const element = document.createElement(tagName);
    element.className = className;
    
    return element;
};

const createMessage = data => {
    const message = newElement('div', 'message');
    const nickname = newElement('div', 'nickname');
    const messageBody = newElement('div', 'message-body');

    message.classList.add(data.messageSide);
    
    nickname.innerHTML = data.nickname;
    messageBody.innerHTML = data.message;
    
    message.appendChild(nickname);
    message.appendChild(messageBody);
    
    return message;
};

const renderMessage = data => {
    if (data.id !== socket.id) {
        data.messageSide = 'left'
    }
  
    const messageLog = document.querySelector('.message-log');
    const message = createMessage(data);
    messageLog.appendChild(message);

    scrollToBottom(messageLog);
};

const scrollToBottom = element => {
    element.scrollTo(0, element.scrollHeight);
};

// socket events
socket.on('previousMessages', messageLog => {
    messageLog.forEach(message => renderMessage(message));
});

socket.on('newMessage', data => {
    renderMessage(data);
});
