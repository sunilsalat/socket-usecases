const joinRoom = async (roomTitle, nsId) => {
  /* 
    when socket wants to join any room , we need to fetch , no of user connected to room from server, 
    so here we have added callback function (ans)=>{} 
  */

  // older way of acknowledgment
  // nameSpaceSockets[nsId].emit("joinRoom", roomTitle, (ans) => {
  //   document.querySelector(
  //     ".curr-room-num-users"
  //   ).innerHTML = `${ans.users}<span class="fa-solid fa-user"></span>`;
  //   document.querySelector(".curr-room-text").innerHTML = roomTitle;
  // });

  // newer way of acknowledgement
  const ackResp = await nameSpaceSockets[nsId].emitWithAck("joinRoom", {
    roomTitle,
    nsId,
  });

  document.querySelector(
    ".curr-room-num-users"
  ).innerHTML = `${ackResp.users}<span class="fa-solid fa-user"></span>`;

  document.querySelector(".curr-room-text").innerHTML = roomTitle;

  document.querySelector("#messages").innerHTML = "";

  console.log(ackResp);
  ackResp.chatHistory.forEach((element) => {
    document.querySelector("#messages").innerHTML += buildMessageHtml(element);
  });
};
