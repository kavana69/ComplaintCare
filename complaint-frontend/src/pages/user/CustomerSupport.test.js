import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import CustomerSupport from "./CustomerSupport";

import { getChatResponse } from "../../services/chatService";

// MOCK chat service
jest.mock("../../services/chatService", () => ({
  getChatResponse: jest.fn(),
}));

describe("CustomerSupport Component", () => {

  beforeEach(() => {

    jest.clearAllMocks();

  });

  test("renders support heading", () => {

    render(<CustomerSupport />);

    expect(
      screen.getByText(/customer support bot/i)
    ).toBeInTheDocument();

  });

  test("renders welcome bot message", () => {

    render(<CustomerSupport />);

    expect(
      screen.getByText(
        /hello 👋 welcome to customer support/i
      )
    ).toBeInTheDocument();

  });

  test("renders input and send button", () => {

    render(<CustomerSupport />);

    expect(
      screen.getByPlaceholderText(
        /type your message/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /send/i,
      })
    ).toBeInTheDocument();

  });

  test("updates input field correctly", () => {

    render(<CustomerSupport />);

    const input =
      screen.getByPlaceholderText(
        /type your message/i
      );

    fireEvent.change(input, {
      target: {
        value: "Need help",
      },
    });

    expect(input.value)
      .toBe("Need help");

  });

  test("sends user message correctly", async () => {

    getChatResponse.mockResolvedValueOnce(
      "How can I assist you?"
    );

    render(<CustomerSupport />);

    const input =
      screen.getByPlaceholderText(
        /type your message/i
      );

    fireEvent.change(input, {
      target: {
        value: "Need support",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /send/i,
      })
    );

    await waitFor(() => {

      expect(
        screen.getByText(/need support/i)
      ).toBeInTheDocument();

    });

  });

  test("calls chatbot service correctly", async () => {

    getChatResponse.mockResolvedValueOnce(
      "Bot Reply"
    );

    render(<CustomerSupport />);

    const input =
      screen.getByPlaceholderText(
        /type your message/i
      );

    fireEvent.change(input, {
      target: {
        value: "Hello bot",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /send/i,
      })
    );

    await waitFor(() => {

      expect(getChatResponse)
        .toHaveBeenCalledWith(
          "Hello bot"
        );

    });

  });

  test("renders bot reply correctly", async () => {

    getChatResponse.mockResolvedValueOnce(
      "I am here to help"
    );

    render(<CustomerSupport />);

    const input =
      screen.getByPlaceholderText(
        /type your message/i
      );

    fireEvent.change(input, {
      target: {
        value: "Help me",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /send/i,
      })
    );

    await waitFor(() => {

      expect(
        screen.getByText(
          /i am here to help/i
        )
      ).toBeInTheDocument();

    });

  });

  test("clears input after sending message", async () => {

    getChatResponse.mockResolvedValueOnce(
      "Reply"
    );

    render(<CustomerSupport />);

    const input =
      screen.getByPlaceholderText(
        /type your message/i
      );

    fireEvent.change(input, {
      target: {
        value: "Test message",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /send/i,
      })
    );

    await waitFor(() => {

      expect(input.value)
        .toBe("");

    });

  });

  test("does not send empty message", async () => {

    render(<CustomerSupport />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /send/i,
      })
    );

    expect(getChatResponse)
      .not.toHaveBeenCalled();

  });

});
