const buildMessageHtml = (object) => {
  return `<li>
                    <div class="user-image">
                        <img src="${object.avatar}" />
                    </div>
                    <div class="user-message">
                        <div class="user-name-time">${
                          object.userName
                        } <span>${new Date(
    object.date
  ).toLocaleString()}</span></div>
                        <div class="message-text">${object.newMessage}</div>
                    </div>
                </li>`;
};
