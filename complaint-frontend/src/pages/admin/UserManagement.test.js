import React from "react";

import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import axios from "axios";

import UserManagement from "./UserManagement";

jest.mock("axios");

describe("UserManagement Component", () => {

  const mockUsers = [
    {
      id: 1,
      username: "Kavana",
      email: "kavana@gmail.com",
      role: "USER",
    },
    {
      id: 2,
      username: "AdminUser",
      email: "admin@gmail.com",
      role: "ADMIN",
    },
    {
      id: 3,
      username: "BlockedUser",
      email: "blocked@gmail.com",
      role: "BLOCKED",
    },
  ];

  beforeEach(() => {

    localStorage.setItem("token", "fake-token");

    axios.get.mockResolvedValue({
      data: mockUsers,
    });

    axios.put.mockResolvedValue({});

    axios.delete.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders heading", async () => {

    render(<UserManagement />);

    expect(
      screen.getByText(/user management/i)
    ).toBeInTheDocument();
  });

  test("fetches and displays users", async () => {

    render(<UserManagement />);

    await waitFor(() => {

      expect(
        screen.getByText("Kavana")
      ).toBeInTheDocument();

      expect(
        screen.getByText("AdminUser")
      ).toBeInTheDocument();

      expect(
        screen.getByText("BlockedUser")
      ).toBeInTheDocument();

    });
  });

  test("calls users API", async () => {

    render(<UserManagement />);

    await waitFor(() => {

      expect(axios.get).toHaveBeenCalledWith(
        "http://localhost:8081/admin/users",
        expect.objectContaining({
          headers: {
            Authorization: "Bearer fake-token",
          },
        })
      );

    });
  });

  test("filters users using search input", async () => {

    render(<UserManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("Kavana")
      ).toBeInTheDocument();
    });

    const searchInput =
      screen.getByPlaceholderText(
        /search by username or email/i
      );

    fireEvent.change(searchInput, {
      target: { value: "AdminUser" },
    });

    expect(
      screen.getByText("AdminUser")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Kavana")
    ).not.toBeInTheDocument();
  });

  test("filters users using role dropdown", async () => {

    render(<UserManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("AdminUser")
      ).toBeInTheDocument();
    });

    const dropdown =
      screen.getByRole("combobox");

    fireEvent.change(dropdown, {
      target: { value: "ADMIN" },
    });

    expect(
      screen.getByText("AdminUser")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Kavana")
    ).not.toBeInTheDocument();
  });

  test("blocks user successfully", async () => {

    render(<UserManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("Kavana")
      ).toBeInTheDocument();
    });

    const blockButtons =
      await screen.findAllByText("Block");

    fireEvent.click(blockButtons[0]);

    await waitFor(() => {

      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:8081/admin/block/1",
        {},
        expect.objectContaining({
          headers: {
            Authorization: "Bearer fake-token",
          },
        })
      );

    });
  });

  test("deletes user successfully", async () => {

    render(<UserManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("Kavana")
      ).toBeInTheDocument();
    });

    const deleteButtons =
      screen.getAllByText(/delete/i);

    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {

      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:8081/admin/delete/1",
        expect.objectContaining({
          headers: {
            Authorization: "Bearer fake-token",
          },
        })
      );

    });
  });

  test("shows no users found message", async () => {

    axios.get.mockResolvedValueOnce({
      data: [],
    });

    render(<UserManagement />);

    await waitFor(() => {

      expect(
        screen.getByText(/no users found/i)
      ).toBeInTheDocument();

    });
  });

  test("handles fetch users API error", async () => {

    console.error = jest.fn();

    axios.get.mockRejectedValueOnce(
      new Error("API Error")
    );

    render(<UserManagement />);

    await waitFor(() => {

      expect(console.error)
        .toHaveBeenCalled();

    });
  });

  test("handles block user API error", async () => {

    console.error = jest.fn();

    axios.put.mockRejectedValueOnce(
      new Error("Block Error")
    );

    render(<UserManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("Kavana")
      ).toBeInTheDocument();
    });

    const blockButtons =
      screen.getAllByText(/block/i);

    fireEvent.click(blockButtons[0]);

    await waitFor(() => {

      expect(console.error)
        .toHaveBeenCalled();

    });
  });

  test("handles delete user API error", async () => {

    console.error = jest.fn();

    axios.delete.mockRejectedValueOnce(
      new Error("Delete Error")
    );

    render(<UserManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("Kavana")
      ).toBeInTheDocument();
    });

    const deleteButtons =
      screen.getAllByText(/delete/i);

    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {

      expect(console.error)
        .toHaveBeenCalled();

    });
  });

});