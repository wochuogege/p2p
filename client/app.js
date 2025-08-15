const socket = io('http://localhost:3000'); // 替换为你的Render服务器URL

const configuration = {
  iceServers: [
    { urls: 'stun:stun.sipgate.net:10000' },
    { urls: 'stun:stun.voip.blackberry.com:3478' },
    { urls: 'stun:stun.stunprotocol.org:3478' },
    { urls: 'stun:stun.miwifi.com:3478' },
    { urls: 'stun:stun.freeswitch.org:3478' },
    { urls: 'stun:stun.callwithus.com:3478' },
    { urls: 'stun:stun.ekiga.net:3478' }
  ]
};

let peerConnection;
let dataChannel;
const room = 'chat-room'; // 可以动态设置

const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const status = document.querySelector('.status');

function addMessage(message, isSent) {
  const div = document.createElement('div');
  div.classList.add('message', isSent ? 'sent' : 'received');
  div.textContent = message;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function createPeerConnection() {
  peerConnection = new RTCPeerConnection(configuration);

  dataChannel = peerConnection.createDataChannel('chat');
  dataChannel.onmessage = (event) => {
    addMessage(event.data, false);
  };
  dataChannel.onopen = () => {
    status.textContent = 'Status: Connected';
    sendButton.disabled = false;
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('candidate', { candidate: event.candidate, room });
    }
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  socket.emit('offer', { offer, room });
}

socket.on('connect', () => {
  socket.emit('join', room);
  createPeerConnection();
});

socket.on('offer', async (offer) => {
  if (!peerConnection) createPeerConnection();
  await peerConnection.setRemoteDescription(offer);
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  socket.emit('answer', { answer, room });
});

socket.on('answer', async (answer) => {
  await peerConnection.setRemoteDescription(answer);
});

socket.on('candidate', async (candidate) => {
  await peerConnection.addIceCandidate(candidate);
});

sendButton.addEventListener('click', () => {
  const message = messageInput.value;
  if (message && dataChannel.readyState === 'open') {
    dataChannel.send(message);
    addMessage(message, true);
    messageInput.value = '';
  }
});

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendButton.click();
});

// 初始化
sendButton.disabled = true;