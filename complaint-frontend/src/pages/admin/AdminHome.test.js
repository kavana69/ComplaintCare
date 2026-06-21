import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminHome from "./AdminHome";

global.fetch = jest.fn();

describe("AdminHome Component", () => {

  beforeEach(() => {

    Storage.prototype.getItem = jest.fn(() => "dummy-token");

    fetch.mockResolvedValue({
      json: async () => [
        {
          id: 1,
          title: "Login Issue",
          status: "OPEN",
          userId: 101,
        },
        {
          id: 2,
          title: "Payment Failed",
          status: "ASSIGNED",
          userId: 102,
        },
        {
          id: 3,
          title: "Bug Error",
          status: "INPROGRESS",
          userId: 103,
        },
        {
          id: 4,
          title: "Server Down",
          status: "RESOLVED",
          userId: 104,
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders welcome admin text", async () => {

    render(<AdminHome />);

    expect(screen.getByText(/welcome admin/i))
      .toBeInTheDocument();
  });

  test("renders complaint statistics", async () => {

    render(<AdminHome />);

    await waitFor(() => {

      expect(screen.getByText(/total complaints/i))
        .toBeInTheDocument();

      expect(screen.getByText(/open complaints/i))
        .toBeInTheDocument();

      expect(screen.getByText(/assigned/i).length)
        .toBeGreaterThan(0);

      expect(screen.getByText(/in progress/i))
        .toBeInTheDocument();

      expect(screen.getByText(/closed complaints/i))
        .toBeInTheDocument();
    });
  });

  test("renders recent complaints table", async () => {

    render(<AdminHome />);

    await waitFor(() => {

      expect(screen.getByText("Login Issue"))
        .toBeInTheDocument();

      expect(screen.getByText("Payment Failed"))
        .toBeInTheDocument();

      expect(screen.getByText("Bug Error"))
        .toBeInTheDocument();

      expect(screen.getByText("Server Down"))
        .toBeInTheDocument();
    });
  });

  test("filters complaints using search input", async () => {

    render(<AdminHome />);

    const input =
      screen.getByPlaceholderText(/search by title/i);

    fireEvent.change(input, {
      target: { value: "Login" },
    });

    await waitFor(() => {

      expect(screen.getByText("Login Issue"))
        .toBeInTheDocument();
    });
  });

  test("filters complaints using status dropdown", async () => {

    render(<AdminHome />);

    const dropdown =
      screen.getByRole("combobox");

    fireEvent.change(dropdown, {
      target: { value: "OPEN" },
    });

    await waitFor(() => {

      expect(screen.getByText("OPEN"))
        .toBeInTheDocument();
    });
  });

  test("calls fetch api", async () => {

    render(<AdminHome />);

    await waitFor(() => {

      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  test("handles empty complaints list", async () => {

    fetch.mockResolvedValueOnce({
      json: async () => [],
    });

    render(<AdminHome />);

    await waitFor(() => {

      expect(screen.getByText(/total complaints/i))
        .toBeInTheDocument();
    });
  });

  test("handles fetch error", async () => {

    fetch.mockRejectedValueOnce(
      new Error("API Error")
    );

    render(<AdminHome />);

    await waitFor(() => {

      expect(fetch).toHaveBeenCalled();
    });
  });

});