const joinNs = (element, nsData) => {
  const nsEndpoint = element.getAttribute("ns");
  console.log(nsEndpoint);

  const clickedNs = nsData.find((row) => row.endpoint === nsEndpoint);

  const rooms = clickedNs.rooms;

  //get the room-list div
  let roomList = document.querySelector(".room-list");
  roomList.innerHTML = "";

  rooms.forEach((room, i) => {
    roomList.innerHTML += `<li class="room" namespaceId=${room.namespaceId}>
            <span class="fa-solid fa-${
              room.privateRoom ? "lock" : "globe"
            }"></span>${room.roomTitle}
        </li>`;
  });

  const allRooms = document.querySelectorAll(".room");

  Array.from(allRooms).forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const elemAtt = elem.getAttribute("namespaceId");
      joinRoom(e.target.innerText, elemAtt);
    });
  });
};
