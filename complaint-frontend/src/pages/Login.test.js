import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Login from "./Login";

import API from "../api/axios";

// MOCK navigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// MOCK axios API
jest.mock("../api/axios");

// MOCK image
jest.mock("../assets/bg.jpg.avif", () => "bg.jpg");

// MOCK atob
global.atob = jest.fn(() =>
  JSON.stringify({
    role: "ADMIN",
  })
);

describe("Login Component", () => {

  beforeEach(() => {

    jest.clearAllMocks();

    localStorage.clear();

    window.alert = jest.fn();

  });

  test("renders login heading", () => {

    render(<Login />);

    expect(
      screen.getByText(/welcome back/i)
    ).toBeInTheDocument();

  });

  test("renders email input", () => {

    render(<Login />);

    expect(
      screen.getByPlaceholderText(/email/i)
    ).toBeInTheDocument();

  });

  test("renders password input", () => {

    render(<Login />);

    expect(
      screen.getByPlaceholderText(/password/i)
    ).toBeInTheDocument();

  });

  test("renders login button", () => {

    render(<Login />);

    expect(
      screen.getByRole("button", {
        name: /login/i,
      })
    ).toBeInTheDocument();

  });

  test("updates email input value", () => {

    render(<Login />);

    const emailInput =
      screen.getByPlaceholderText(/email/i);

    fireEvent.change(emailInput, {
      target: {
        value: "test@gmail.com",
      },
    });

    expect(emailInput.value)
      .toBe("test@gmail.com");

  });

  test("updates password input value", () => {

    render(<Login />);

    const passwordInput =
      screen.getByPlaceholderText(/password/i);

    fireEvent.change(passwordInput, {
      target: {
        value: "123456",
      },
    });

    expect(passwordInput.value)
      .toBe("123456");

  });

  test("successful admin login navigates to admin", async () => {

    const fakeToken =
      "header.payload.signature";

    API.post.mockResolvedValueOnce({
      data: {
        data: {
          name: "Admin",
          email: "admin@gmail.com",
          id: 1,
          token: fakeToken,
        },
      },
    });

    render(<Login />);

    fireEvent.change(
      screen.getByPlaceholderText(/email/i),
      {
        target: {
          value: "admin@gmail.com",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(/password/i),
      {
        target: {
          value: "123456",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /login/i,
      })
    );

    await waitFor(() => {

      expect(API.post)
        .toHaveBeenCalledWith(
          "/auth/login",
          {
            email: "admin@gmail.com",
            password: "123456",
          }
        );

    });

    expect(
      localStorage.getItem("name")
    ).toBe("Admin");

    expect(
      localStorage.getItem("email")
    ).toBe("admin@gmail.com");

    expect(
      localStorage.getItem("userId")
    ).toBe("1");

    expect(
      localStorage.getItem("token")
    ).toBe(fakeToken);

    

  });

  test("successful user login navigates to user", async () => {

    global.atob = jest.fn(() =>
      JSON.stringify({
        role: "USER",
      })
    );

    const fakeToken =
      "header.payload.signature";

    API.post.mockResolvedValueOnce({
      data: {
        data: {
          name: "User",
          email: "user@gmail.com",
          id: 2,
          token: fakeToken,
        },
      },
    });

    render(<Login />);

    fireEvent.change(
      screen.getByPlaceholderText(/email/i),
      {
        target: {
          value: "user@gmail.com",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(/password/i),
      {
        target: {
          value: "123456",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /login/i,
      })
    );

    await waitFor(() => {

      expect(mockNavigate)
        .toHaveBeenCalledWith("/user");

    });

  });

  test("handles login failure", async () => {

    API.post.mockRejectedValueOnce(
      new Error("Login failed")
    );

    render(<Login />);

    fireEvent.change(
      screen.getByPlaceholderText(/email/i),
      {
        target: {
          value: "wrong@gmail.com",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(/password/i),
      {
        target: {
          value: "wrongpass",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /login/i,
      })
    );

    await waitFor(() => {

      expect(window.alert)
        .toHaveBeenCalledWith(
          "Login failed"
        );

    });

  });

  test("register link exists", () => {

    render(<Login />);

    expect(
      screen.getByText(/register/i)
    ).toBeInTheDocument();

  });

  test("forgot password navigation works", () => {

    render(<Login />);

    fireEvent.click(
      screen.getByText(
        /forgot password/i
      )
    );

    expect(mockNavigate)
      .toHaveBeenCalledWith(
        "/forgot-password"
      );

  });

});