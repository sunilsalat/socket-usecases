const joinRoom = (roomTitle, nsId) => {
  console.log(roomTitle, nsId);
  nameSpaceSockets[nsId].emit("joinRoom", roomTitle, (ans) => {
    console.log(ans);
  });
};
