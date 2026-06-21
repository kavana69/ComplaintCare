import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import axios from "axios";

import NotificationBell from "./NotificationBell";

// MOCK axios
jest.mock("axios");

// MOCK react-icons
jest.mock("react-icons/fa", () => ({
  FaBell: () => <div>BellIcon</div>,
}));

describe("NotificationBell Component", () => {

  beforeEach(() => {

    jest.clearAllMocks();

    localStorage.setItem(
      "email",
      "test@gmail.com"
    );

  });

  afterEach(() => {

    localStorage.clear();

  });

  test("renders bell icon", async () => {

    axios.get.mockResolvedValueOnce({
      data: [],
    });

    render(<NotificationBell />);

    expect(
      screen.getByText(/bellicon/i)
    ).toBeInTheDocument();

  });

  test("fetches notifications correctly", async () => {

    axios.get.mockResolvedValueOnce({
      data: [],
    });

    render(<NotificationBell />);

    await waitFor(() => {

      expect(axios.get)
        .toHaveBeenCalledWith(
          "http://localhost:8085/notifications/email/test@gmail.com"
        );

    });

  });

  test("shows notification badge when notifications exist", async () => {

    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          message: "Complaint Updated",
          timestamp:
            "2025-01-01T10:00:00",
        },
      ],
    });

    render(<NotificationBell />);

    await waitFor(() => {

      expect(
        screen.getByText("1")
      ).toBeInTheDocument();

    });

  });

  test("opens notification panel on click", async () => {

    axios.get.mockResolvedValueOnce({
      data: [],
    });

    render(<NotificationBell />);

    fireEvent.click(
      screen.getByText(/bellicon/i)
    );

    expect(
      screen.getByText(
        /notifications/i
      )
    ).toBeInTheDocument();

  });

  test("shows no notifications message", async () => {

    axios.get.mockResolvedValueOnce({
      data: [],
    });

    render(<NotificationBell />);

    fireEvent.click(
      screen.getByText(/bellicon/i)
    );

    expect(
      screen.getByText(
        /no notifications/i
      )
    ).toBeInTheDocument();

  });

  test("renders notification messages", async () => {

    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          message:
            "Complaint resolved",
          timestamp:
            "2025-01-01T10:00:00",
        },
        {
          id: 2,
          message:
            "New complaint assigned",
          timestamp:
            "2025-01-02T12:00:00",
        },
      ],
    });

    render(<NotificationBell />);

    fireEvent.click(
      screen.getByText(/bellicon/i)
    );

    await waitFor(() => {

      expect(
        screen.getByText(
          /complaint resolved/i
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /new complaint assigned/i
        )
      ).toBeInTheDocument();

    });

  });

  test("handles API error properly", async () => {

    console.log = jest.fn();

    axios.get.mockRejectedValueOnce(
      new Error("API Error")
    );

    render(<NotificationBell />);

    await waitFor(() => {

      expect(console.log)
        .toHaveBeenCalled();

    });

  });

  test("toggles notification panel", async () => {

    axios.get.mockResolvedValueOnce({
      data: [],
    });

    render(<NotificationBell />);

    const bell =
      screen.getByText(/bellicon/i);

    fireEvent.click(bell);

    expect(
      screen.getByText(
        /notifications/i
      )
    ).toBeInTheDocument();

    fireEvent.click(bell);

    expect(
      screen.queryByText(
        /notifications/i
      )
    ).not.toBeInTheDocument();

  });

});