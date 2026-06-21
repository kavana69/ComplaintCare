import React from "react";

import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import ComplaintHistory from "./ComplaintHistory";

import API from "../../api/axios";

// MOCK API
jest.mock("../../api/axios");

describe("ComplaintHistory Component", () => {

  beforeEach(() => {

    jest.clearAllMocks();

    localStorage.setItem(
      "email",
      "test@gmail.com"
    );

  });

  test("renders complaint history heading", () => {

    API.get.mockResolvedValueOnce({
      data: [],
    });

    render(<ComplaintHistory />);

    expect(
      screen.getByText(/complaint history/i)
    ).toBeInTheDocument();

  });

  test("calls API correctly", async () => {

    API.get.mockResolvedValueOnce({
      data: [],
    });

    render(<ComplaintHistory />);

    await waitFor(() => {

      expect(API.get)
        .toHaveBeenCalledWith(
          "/complaints/email/test@gmail.com"
        );

    });

  });

  test("renders complaint data properly", async () => {

    API.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          title: "Water Leakage",
          status: "OPEN",
          createdAt:
            "2025-01-01T10:00:00",
        },
        {
          id: 2,
          title: "Electricity Issue",
          status: "RESOLVED",
          createdAt:
            "2025-01-02T12:00:00",
        },
      ],
    });

    render(<ComplaintHistory />);

    await waitFor(() => {

      expect(
        screen.getByText(/water leakage/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/electricity issue/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/open/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/resolved/i)
      ).toBeInTheDocument();

    });

  });

  test("renders table headers", async () => {

    API.get.mockResolvedValueOnce({
      data: [],
    });

    render(<ComplaintHistory />);

    expect(
      screen.getByText(/created time/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/title/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/status/i)
    ).toBeInTheDocument();

  });

  test("handles API error properly", async () => {

    console.error = jest.fn();

    API.get.mockRejectedValueOnce(
      new Error("API Error")
    );

    render(<ComplaintHistory />);

    await waitFor(() => {

      expect(console.error)
        .toHaveBeenCalled();

    });

  });

  test("renders multiple complaint rows", async () => {

    API.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          title: "Network Issue",
          status: "OPEN",
          createdAt:
            "2025-01-03T09:00:00",
        },
      ],
    });

    render(<ComplaintHistory />);

    await waitFor(() => {

      const rows =
        screen.getAllByRole("row");

      expect(rows.length)
        .toBeGreaterThan(1);

    });

  });

});