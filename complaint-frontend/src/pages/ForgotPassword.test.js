import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import ForgotPassword from "./ForgotPassword";

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

describe("ForgotPassword Component", () => {

  beforeEach(() => {

    jest.clearAllMocks();

    window.alert = jest.fn();

  });

  test("renders forgot password heading", () => {

    render(<ForgotPassword />);

    expect(
      screen.getByText(/forgot password/i)
    ).toBeInTheDocument();

  });

  test("renders all input fields", () => {

    render(<ForgotPassword />);

    expect(
      screen.getByPlaceholderText(/email/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/old password/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/enter otp/i)
    ).toBeInTheDocument();

  });

  test("renders buttons", () => {

    render(<ForgotPassword />);

    expect(
      screen.getByRole("button", {
        name: /send otp/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /verify otp/i,
      })
    ).toBeInTheDocument();

  });

  test("updates email input", () => {

    render(<ForgotPassword />);

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

  test("updates old password input", () => {

    render(<ForgotPassword />);

    const passwordInput =
      screen.getByPlaceholderText(
        /old password/i
      );

    fireEvent.change(passwordInput, {
      target: {
        value: "123456",
      },
    });

    expect(passwordInput.value)
      .toBe("123456");

  });

  test("updates otp input", () => {

    render(<ForgotPassword />);

    const otpInput =
      screen.getByPlaceholderText(
        /enter otp/i
      );

    fireEvent.change(otpInput, {
      target: {
        value: "9999",
      },
    });

    expect(otpInput.value)
      .toBe("9999");

  });

  test("sends OTP successfully", async () => {

    API.post.mockResolvedValueOnce({
      data: {},
    });

    render(<ForgotPassword />);

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
          "/users/forgot-password/send-otp?email=test@gmail.com"
        );

    });

    expect(window.alert)
      .toHaveBeenCalledWith(
        "OTP sent successfully"
      );

  });

  test("handles send OTP failure", async () => {

    API.post.mockRejectedValueOnce(
      new Error("Failed")
    );

    render(<ForgotPassword />);

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

  test("verifies OTP successfully", async () => {

    API.post.mockResolvedValueOnce({
      data: {},
    });

    render(<ForgotPassword />);

    fireEvent.change(
      screen.getByPlaceholderText(/email/i),
      {
        target: {
          value: "test@gmail.com",
        },
      }
    );

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
        name: /verify otp/i,
      })
    );

    await waitFor(() => {

      expect(API.post)
        .toHaveBeenCalledWith(
          "/users/forgot-password/verify-otp",
          {
            email: "test@gmail.com",
            otp: "1234",
          }
        );

    });

    expect(window.alert)
      .toHaveBeenCalledWith(
        "OTP verified"
      );

    expect(mockNavigate)
      .toHaveBeenCalledWith(
        "/reset-password",
        {
          state: {
            email: "test@gmail.com",
          },
        }
      );

  });

  test("handles invalid OTP", async () => {

    API.post.mockRejectedValueOnce(
      new Error("Invalid OTP")
    );

    render(<ForgotPassword />);

    fireEvent.change(
      screen.getByPlaceholderText(/email/i),
      {
        target: {
          value: "test@gmail.com",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        /enter otp/i
      ),
      {
        target: {
          value: "0000",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /verify otp/i,
      })
    );

    await waitFor(() => {

      expect(window.alert)
        .toHaveBeenCalledWith(
          "Invalid OTP"
        );

    });

  });

});