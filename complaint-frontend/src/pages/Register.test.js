import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Register from "./Register";

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

describe("Register Component", () => {

  beforeEach(() => {

    jest.clearAllMocks();

    window.alert = jest.fn();

  });

  test("renders register heading", () => {

    render(<Register />);

    expect(
      screen.getByText(/register/i)
    ).toBeInTheDocument();

  });

  test("renders all input fields initially", () => {

    render(<Register />);

    expect(
      screen.getByPlaceholderText(/name/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/email/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/password/i)
    ).toBeInTheDocument();

  });

  test("updates name input", () => {

    render(<Register />);

    const nameInput =
      screen.getByPlaceholderText(/name/i);

    fireEvent.change(nameInput, {
      target: {
        value: "Kavana",
      },
    });

    expect(nameInput.value)
      .toBe("Kavana");

  });

  test("updates email input", () => {

    render(<Register />);

    const emailInput =
      screen.getByPlaceholderText(/email/i);

    fireEvent.change(emailInput, {
      target: {
        value: "kavana@gmail.com",
      },
    });

    expect(emailInput.value)
      .toBe("kavana@gmail.com");

  });

  test("updates password input", () => {

    render(<Register />);

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

  test("sends OTP successfully", async () => {

    API.post.mockResolvedValueOnce({
      data: {},
    });

    render(<Register />);

    fireEvent.change(
      screen.getByPlaceholderText(/email/i),
      {
        target: {
          value: "test@gmail.com",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /send otp/i,
      })
    );

    await waitFor(() => {

      expect(API.post)
        .toHaveBeenCalledWith(
          "/users/send-otp",
          {
            email: "test@gmail.com",
          }
        );

    });

    expect(window.alert)
      .toHaveBeenCalledWith(
        "OTP sent successfully"
      );

  });

  test("shows OTP input after OTP sent", async () => {

    API.post.mockResolvedValueOnce({
      data: {},
    });

    render(<Register />);

    fireEvent.change(
      screen.getByPlaceholderText(/email/i),
      {
        target: {
          value: "test@gmail.com",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /send otp/i,
      })
    );

    await waitFor(() => {

      expect(
        screen.getByPlaceholderText(
          /enter otp/i
        )
      ).toBeInTheDocument();

    });

  });

  test("handles send OTP failure", async () => {

    API.post.mockRejectedValueOnce(
      new Error("OTP Error")
    );

    render(<Register />);

    fireEvent.change(
      screen.getByPlaceholderText(/email/i),
      {
        target: {
          value: "wrong@gmail.com",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /send otp/i,
      })
    );

    await waitFor(() => {

      expect(window.alert)
        .toHaveBeenCalledWith(
          "Failed to send OTP"
        );

    });

  });

  test("registers successfully after OTP verification", async () => {

    API.post
      .mockResolvedValueOnce({
        data: {},
      })
      .mockResolvedValueOnce({
        data: {},
      });

    render(<Register />);

    fireEvent.change(
      screen.getByPlaceholderText(/name/i),
      {
        target: {
          value: "Kavana",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(/email/i),
      {
        target: {
          value: "kavana@gmail.com",
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
        name: /send otp/i,
      })
    );

    await waitFor(() => {

      expect(
        screen.getByPlaceholderText(
          /enter otp/i
        )
      ).toBeInTheDocument();

    });

    fireEvent.change(
      screen.getByPlaceholderText(
        /enter otp/i
      ),
      {
        target: {
          value: "1234",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /^register$/i,
      })
    );

    await waitFor(() => {

      expect(API.post)
        .toHaveBeenCalledWith(
          "/users/verify-register",
          {
            name: "Kavana",
            email: "kavana@gmail.com",
            password: "123456",
            otp: "1234",
          }
        );

    });

    expect(window.alert)
      .toHaveBeenCalledWith(
        "Registration successful"
      );

    expect(mockNavigate)
      .toHaveBeenCalledWith("/");

  });

  test("handles registration failure", async () => {

    API.post.mockRejectedValueOnce(
      new Error("Register Error")
    );

    render(<Register />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /^register$/i,
      })
    );

    await waitFor(() => {

      expect(window.alert)
        .toHaveBeenCalledWith(
          "Invalid OTP or registration failed"
        );

    });

  });

  test("login navigation works", () => {

    render(<Register />);

    fireEvent.click(
      screen.getByText(/login/i)
    );

    expect(mockNavigate)
      .toHaveBeenCalledWith("/");

  });

});