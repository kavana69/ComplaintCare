export async function getChatResponse(message) {

  try {

    const response = await fetch(
      "http://localhost:8083/chatbot/message",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      }
    );

    const data = await response.json();

    return data.reply;

  } catch (error) {

    console.error(error);

    return "Unable to connect to AI support.";
  }
}