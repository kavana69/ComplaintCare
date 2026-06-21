import { getChatResponse } from "./chatService";

describe("chatService", () => {

  beforeEach(() => {

    global.fetch = jest.fn();

    jest.clearAllMocks();

  });

  test("returns chatbot reply successfully", async () => {

    fetch.mockResolvedValueOnce({
      json: async () => ({
        reply: "Hello user!",
      }),
    });

    const result =
      await getChatResponse(
        "Hi"
      );

    expect(fetch)
      .toHaveBeenCalledWith(
        "http://localhost:8083/chatbot/message",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: "Hi",
          }),
        }
      );

    expect(result)
      .toBe("Hello user!");

  });

  test("handles API failure correctly", async () => {

    console.error = jest.fn();

    fetch.mockRejectedValueOnce(
      new Error("API Error")
    );

    const result =
      await getChatResponse(
        "Help"
      );

    expect(console.error)
      .toHaveBeenCalled();

    expect(result)
      .toBe(
        "Unable to connect to AI support."
      );

  });

  test("calls fetch exactly once", async () => {

    fetch.mockResolvedValueOnce({
      json: async () => ({
        reply: "Test reply",
      }),
    });

    await getChatResponse(
      "Testing"
    );

    expect(fetch)
      .toHaveBeenCalledTimes(1);

  });

  test("sends correct message payload", async () => {

    fetch.mockResolvedValueOnce({
      json: async () => ({
        reply: "Received",
      }),
    });

    await getChatResponse(
      "Complaint issue"
    );

    const fetchCall =
      fetch.mock.calls[0];

    const options =
      fetchCall[1];

    expect(options.body)
      .toBe(
        JSON.stringify({
          message:
            "Complaint issue",
        })
      );

  });

});