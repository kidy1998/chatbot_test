var stompClient = null;


function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    $("#send").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#msg").html("");
}


function connect() {

    const mainContent = document.getElementById('main-content');
    mainContent.style.visibility = 'visible';
    document.getElementById('msg').focus();
    var socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.send("/app/sendMessage", {}, JSON.stringify("welcome")); //서버에 보낼 메시지
        stompClient.subscribe('/topic/public', function (message) {
            showMessage("받은 메시지: " + message.body); //서버에 메시지 전달 후 리턴받는 메시지
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
    $("#communicate").empty(); // 자식 요소 제거
    const mainContent = document.getElementById('main-content');
    mainContent.style.visibility = 'hidden';
}

function sendMessage() {
    let message = $("#msg").val()
    showMessage("보낸 메시지: " + message);

    stompClient.send("/app/sendMessage", {}, JSON.stringify(message)); //서버에 보낼 메시지
    $("#msg").val(""); // 입력 필드 초기화
}

function showMessage(message) {
    $("#communicate").append("<tr><td>" + message + "</td></tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();     //form 태그의 페이지 이동 기능을 막음
    });

    $("#connect").click(function () {
        connect();
    });

    $("#disconnect").click(function () {
        disconnect(); 
    });
    
    $( "#send" ).click(function() { sendMessage(); });   // 보내기 버튼 누르면 실행
});


/*
document.getElementById('connect').addEventListener('click', function () {
    // 챗봇 이미지 클릭 시 실행되는 함수
    document.getElementById('main-content').style.display = 'block';
});

document.getElementById('disconnect').addEventListener('click', function () {
    // 챗봇 이미지 클릭 시 실행되는 함수
    document.getElementById('main-content').style.display = 'none';
});
*/


// const disconnectButton = document.getElementById('disconnect');


