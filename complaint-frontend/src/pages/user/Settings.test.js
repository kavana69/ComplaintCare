import React from "react";

import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Settings from "./Settings";

// MOCK NAVIGATE
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Settings Component", () => {

  beforeEach(() => {

    localStorage.clear();

    jest.clearAllMocks();

    document.body.className = "";

  });

  test("renders settings heading", () => {

    render(<Settings />);

    expect(
      screen.getByText(/settings/i)
    ).toBeInTheDocument();

  });

  test("renders dark mode text", () => {

    render(<Settings />);

    expect(
      screen.getByText(/dark mode/i)
    ).toBeInTheDocument();

  });

  test("renders notifications text", () => {

    render(<Settings />);

    expect(
      screen.getByText(/notifications/i)
    ).toBeInTheDocument();

  });

  test("renders reset button", () => {

    render(<Settings />);

    expect(
      screen.getByRole("button", {
        name: /reset/i,
      })
    ).toBeInTheDocument();

  });

  test("renders logout button", () => {

    render(<Settings />);

    expect(
      screen.getByRole("button", {
        name: /logout/i,
      })
    ).toBeInTheDocument();

  });

  test("dark mode toggles ON", () => {

    render(<Settings />);

    const checkboxes =
      screen.getAllByRole("checkbox");

    const darkToggle = checkboxes[0];

    fireEvent.click(darkToggle);

    expect(darkToggle.checked)
      .toBe(true);

    expect(
      document.body.classList.contains(
        "dark-mode"
      )
    ).toBe(true);

    expect(
      localStorage.getItem("darkMode")
    ).toBe("true");

  });

  test("dark mode toggles OFF", () => {

    localStorage.setItem(
      "darkMode",
      "true"
    );

    render(<Settings />);

    const checkboxes =
      screen.getAllByRole("checkbox");

    const darkToggle = checkboxes[0];

    fireEvent.click(darkToggle);

    expect(darkToggle.checked)
      .toBe(false);

    expect(
      document.body.classList.contains(
        "dark-mode"
      )
    ).toBe(false);

    expect(
      localStorage.getItem("darkMode")
    ).toBe("false");

  });

  test("notifications checkbox exists", () => {

    render(<Settings />);

    const checkboxes =
      screen.getAllByRole("checkbox");

    expect(
      checkboxes.length
    ).toBeGreaterThan(1);

  });

  test("logout clears localStorage", () => {

    localStorage.setItem(
      "token",
      "abc"
    );

    localStorage.setItem(
      "email",
      "abc@gmail.com"
    );

    localStorage.setItem(
      "name",
      "Kavana"
    );

    render(<Settings />);

    const logoutBtn =
      screen.getByRole("button", {
        name: /logout/i,
      });

    fireEvent.click(logoutBtn);

    expect(
      localStorage.getItem("token")
    ).toBe(null);

    expect(
      localStorage.getItem("email")
    ).toBe(null);

    expect(
      localStorage.getItem("name")
    ).toBe(null);

  });

  test("logout navigates to home page", () => {

    render(<Settings />);

    const logoutBtn =
      screen.getByRole("button", {
        name: /logout/i,
      });

    fireEvent.click(logoutBtn);

    expect(mockNavigate)
      .toHaveBeenCalledWith("/");

  });

});