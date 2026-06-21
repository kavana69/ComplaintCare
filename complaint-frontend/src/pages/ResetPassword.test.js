import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import ResetPassword from "./ResetPassword";

import API from "../api/axios";

// MOCK navigate
const mockNavigate = jest.fn();

// MOCK router hooks
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,

  useLocation: () => ({
    state: {
      email: "test@gmail.com",
    },
  }),
}));

// MOCK API
jest.mock("../api/axios");

// MOCK image
jest.mock("../assets/bg.jpg.avif", () => "bg.jpg");

describe("ResetPassword Component", () => {

  beforeEach(() => {

    jest.clearAllMocks();

    window.alert = jest.fn();

  });

  test("renders reset password heading", () => {

    render(<ResetPassword />);

    expect(
      screen.getAllByText(
        /reset password/i
      ).length
    ).toBeGreaterThan(0);

  });

  test("renders password input fields", () => {

    render(<ResetPassword />);

    expect(
      screen.getByPlaceholderText(
        /new password/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /confirm password/i
      )
    ).toBeInTheDocument();

  });

  test("renders update password button", () => {

    render(<ResetPassword />);

    expect(
      screen.getByRole("button", {
        name: /update password/i,
      })
    ).toBeInTheDocument();

  });

  test("updates new password input", () => {

    render(<ResetPassword />);

    const newPasswordInput =
      screen.getByPlaceholderText(
        /new password/i
      );

    fireEvent.change(newPasswordInput, {
      target: {
        value: "123456",
      },
    });

    expect(newPasswordInput.value)
      .toBe("123456");

  });

  test("updates confirm password input", () => {

    render(<ResetPassword />);

    const confirmPasswordInput =
      screen.getByPlaceholderText(
        /confirm password/i
      );

    fireEvent.change(confirmPasswordInput, {
      target: {
        value: "123456",
      },
    });

    expect(confirmPasswordInput.value)
      .toBe("123456");

  });

  test("shows alert when passwords do not match", () => {

    render(<ResetPassword />);

    fireEvent.change(
      screen.getByPlaceholderText(
        /new password/i
      ),
      {
        target: {
          value: "123456",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        /confirm password/i
      ),
      {
        target: {
          value: "654321",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /update password/i,
      })
    );

    expect(window.alert)
      .toHaveBeenCalledWith(
        "Passwords do not match"
      );

  });

  test("resets password successfully", async () => {

    API.put.mockResolvedValueOnce({
      data: {},
    });

    render(<ResetPassword />);

    fireEvent.change(
      screen.getByPlaceholderText(
        /new password/i
      ),
      {
        target: {
          value: "123456",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        /confirm password/i
      ),
      {
        target: {
          value: "123456",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /update password/i,
      })
    );

    await waitFor(() => {

      expect(API.put)
        .toHaveBeenCalledWith(
          "/users/forgot-password/reset",
          {
            email: "test@gmail.com",
            newPassword: "123456",
            confirmPassword: "123456",
          }
        );

    });

    expect(window.alert)
      .toHaveBeenCalledWith(
        "Password updated successfully"
      );

    expect(mockNavigate)
      .toHaveBeenCalledWith("/");

  });

  test("handles reset password failure", async () => {

    API.put.mockRejectedValueOnce(
      new Error("Reset failed")
    );

    render(<ResetPassword />);

    fireEvent.change(
      screen.getByPlaceholderText(
        /new password/i
      ),
      {
        target: {
          value: "123456",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        /confirm password/i
      ),
      {
        target: {
          value: "123456",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /update password/i,
      })
    );

    await waitFor(() => {

      expect(window.alert)
        .toHaveBeenCalledWith(
          "Password reset failed"
        );

    });

  });

});