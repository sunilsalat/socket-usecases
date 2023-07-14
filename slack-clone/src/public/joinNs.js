const joinNs = (element, nsData) => {
  const nsEndpoint = element.getAttribute("ns");
  console.log(nsEndpoint);

  const clickedNs = nsData.find((row) => row.endpoint === nsEndpoint);

  // setting global variable in script.js file
  selectedNsId = clickedNs.id;

  const rooms = clickedNs.rooms;

  let roomList = document.querySelector(".room-list");
  roomList.innerHTML = "";

  let firstRoom;

  rooms.forEach((room, i) => {
    if (i === 0) {
      firstRoom = room.roomTitle;
    }
    roomList.innerHTML += `<li class="room" namespaceId=${room.namespaceId}>
            <span class="fa-solid fa-${
              room.privateRoom ? "lock" : "globe"
            }"></span>${room.roomTitle}
        </li>`;
  });

  joinRoom(firstRoom, clickedNs.id);

  const allRooms = document.querySelectorAll(".room");

  Array.from(allRooms).forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const elemAtt = elem.getAttribute("namespaceId");
      joinRoom(e.target.innerText, elemAtt);
    });
  });
};
