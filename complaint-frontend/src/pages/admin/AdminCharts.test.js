import { render, screen, waitFor } from "@testing-library/react";
import AdminCharts from "./AdminCharts";
import axios from "axios";
import "@testing-library/jest-dom";

jest.mock("axios");

// MOCK RECHARTS
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: () => <div>Bar</div>,
  PieChart: ({ children }) => <div>{children}</div>,
  Pie: () => <div>Pie</div>,
  Cell: () => <div>Cell</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
  CartesianGrid: () => <div>Grid</div>,
  Legend: () => <div>Legend</div>,
  LineChart: ({ children }) => <div>{children}</div>,
  Line: () => <div>Line</div>,
}));

describe("AdminCharts Component", () => {

  beforeEach(() => {

    Storage.prototype.getItem = jest.fn(() => "mock-token");

    axios.get.mockImplementation((url) => {

      // USERS API
      if (url.includes("/admin/users")) {

        return Promise.resolve({
          data: [
            {
              id: 1,
              role: "ROLE_ADMIN",
            },
            {
              id: 2,
              role: "ROLE_USER",
            },
          ],
        });
      }

      // COMPLAINTS API
      if (url.includes("/complaints")) {

        return Promise.resolve({
          data: [
            {
              id: 1,
              status: "OPEN",
              createdAt: "2025-05-18T10:00:00",
            },
            {
              id: 2,
              status: "ASSIGNED",
              createdAt: "2025-05-19T10:00:00",
            },
            {
              id: 3,
              status: "INPROGRESS",
              createdAt: "2025-05-20T10:00:00",
            },
            {
              id: 4,
              status: "RESOLVED",
              createdAt: "2025-05-21T10:00:00",
            },
          ],
        });
      }

      return Promise.resolve({ data: [] });

    });

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders analytics dashboard", async () => {

    render(<AdminCharts />);

    expect(
      screen.getByText(/analytics dashboard/i)
    ).toBeInTheDocument();

  });

  test("renders complaint statistics", async () => {

    render(<AdminCharts />);

    await waitFor(() => {

      expect(
        screen.getByText(/total complaints/i)
      ).toBeInTheDocument();

      expect(
  screen.getAllByText(/open/i).length
).toBeGreaterThan(0);

expect(
  screen.getAllByText(/assigned/i).length
).toBeGreaterThan(0);

expect(
  screen.getAllByText(/in progress/i).length
).toBeGreaterThan(0);

expect(
  screen.getAllByText(/resolved/i).length
).toBeGreaterThan(0);

    });

  });

  test("renders user analytics", async () => {

    render(<AdminCharts />);

    await waitFor(() => {

      expect(
        screen.getByText(/user registration analytics/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/total users/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/admins/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/normal users/i)
      ).toBeInTheDocument();

    });

  });

  test("calls users api", async () => {

    render(<AdminCharts />);

    await waitFor(() => {

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:8081/admin/users",
        expect.any(Object)
      );

    });

  });

  test("calls complaints api", async () => {

    render(<AdminCharts />);

    await waitFor(() => {

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:8080/complaints",
        expect.any(Object)
      );

    });

  });

  test("handles api failure", async () => {

    axios.get.mockRejectedValue(new Error("API ERROR"));

    render(<AdminCharts />);

    await waitFor(() => {

      expect(axios.get).toHaveBeenCalled();

    });

  });

  test("handles empty response", async () => {

    axios.get.mockResolvedValue({
      data: [],
    });

    render(<AdminCharts />);

    await waitFor(() => {

      expect(
        screen.getByText(/analytics dashboard/i)
      ).toBeInTheDocument();

    });

  });

});