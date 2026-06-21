import "@testing-library/jest-dom";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";

import AdminComplaints from "./AdminComplaints";

global.fetch = jest.fn();

describe("AdminComplaints Component", () => {

  beforeEach(() => {

    Storage.prototype.getItem = jest.fn(() => "mock-token");

    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue([
        {
          id: 1,
          title: "Water Leakage",
          description: "Pipe issue",
          status: "OPEN",
          userId: 101,
          createdAt: "2025-05-18",
          updatedAt: "2025-05-18",
        },
        {
          id: 2,
          title: "Road Damage",
          description: "Road broken",
          status: "RESOLVED",
          userId: 102,
          createdAt: "2025-05-19",
          updatedAt: "2025-05-20",
        },
      ]),
    });

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders complaints title", async () => {

    render(<AdminComplaints />);

    expect(
      screen.getByText(/all complaints/i)
    ).toBeInTheDocument();

  });

  test("fetches and displays complaints", async () => {

    render(<AdminComplaints />);

    await waitFor(() => {

      expect(
        screen.getByText(/water leakage/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/road damage/i)
      ).toBeInTheDocument();

    });

  });

  test("filters complaints using search", async () => {

    render(<AdminComplaints />);

    await waitFor(() => {

      expect(
        screen.getByText(/water leakage/i)
      ).toBeInTheDocument();

    });

    const input = screen.getByPlaceholderText(
      /search by title/i
    );

    fireEvent.change(input, {
      target: {
        value: "Water",
      },
    });

    expect(
      screen.getByText(/water leakage/i)
    ).toBeInTheDocument();

  });

  test("filters complaints using status dropdown", async () => {

    render(<AdminComplaints />);

    await waitFor(() => {

      expect(
        screen.getByText(/road damage/i)
      ).toBeInTheDocument();

    });

    const select =
      screen.getAllByRole("combobox")[0];

    fireEvent.change(select, {
      target: {
        value: "RESOLVED",
      },
    });

    expect(
      screen.getByText(/road damage/i)
    ).toBeInTheDocument();

  });

  test("shows no complaints found message", async () => {

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue([]),
    });

    render(<AdminComplaints />);

    await waitFor(() => {

      expect(
        screen.getByText(/no complaints found/i)
      ).toBeInTheDocument();

    });

  });

  test("calls complaints api", async () => {

    render(<AdminComplaints />);

    await waitFor(() => {

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/complaints",
        expect.any(Object)
      );

    });

  });

  test("updates complaint status", async () => {

    render(<AdminComplaints />);

    await waitFor(() => {

      expect(
        screen.getByText(/water leakage/i)
      ).toBeInTheDocument();

    });

    const dropdowns =
      screen.getAllByRole("combobox");

    fireEvent.change(dropdowns[1], {
      target: {
        value: "ASSIGNED",
      },
    });

    await waitFor(() => {

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:8080/complaints/1/status",
        expect.objectContaining({
          method: "PUT",
        })
      );

    });

  });

  test("handles fetch error", async () => {

    fetch.mockRejectedValueOnce(
      new Error("API ERROR")
    );

    render(<AdminComplaints />);

    await waitFor(() => {

      expect(fetch).toHaveBeenCalled();

    });

  });

});