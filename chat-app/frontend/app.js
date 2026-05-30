document.addEventListener("DOMContentLoaded", () => {
  const messagesList = document.getElementById("messages-list");
  const form = document.getElementById("message-form");
  const messageInput = document.getElementById("message-input");
  const usernameInput = document.getElementById("username-input");

  const BACKEND_URL = "https://zabihollah-namazi-chat-app-backend.hosting.codeyourfuture.io";

  async function loadMessages() {
    try {
      const res = await fetch(BACKEND_URL);

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }
    const messages = await res.json();

    messagesList.innerHTML = "";

    messages.forEach((msg) => {
      const li = document.createElement("li");
      const usernameDiv = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = msg.username;

      usernameDiv.appendChild(strong);

      const textDiv = document.createElement("div");
      textDiv.textContent = msg.text;

      const time = document.createElement("small");
      time.textContent = msg.timeStamp;

      li.appendChild(usernameDiv);
      li.appendChild(textDiv);
      li.appendChild(time);
      messagesList.appendChild(li);
    });
    } catch (err) {
      console.error("Failed to load messages:", err);
      messagesList.innerHTML = "<li>Failed to load messages</li>";
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const text = messageInput.value.trim();

    //VALIDATION
    if (!username || !text) {
      alert("Username and message cannot be empty");
      return;
    }

    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, text }),
      });

      // HANDLE SERVER ERRORS
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to send message");
      }

      messageInput.value = "";
      loadMessages();

    } catch (err) {
      console.error("Send failed:", err);
      alert("Failed to send message");
    }
  });

  loadMessages();
  setInterval(loadMessages, 1000);
});

