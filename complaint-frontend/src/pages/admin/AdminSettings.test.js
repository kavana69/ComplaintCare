import React from "react";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import AdminSettings from "./AdminSettings";

describe("AdminSettings Component", () => {

  beforeEach(() => {

    localStorage.clear();

    document.body.className = "";

    delete window.location;

    window.location = {
      href: "",
    };

    window.alert = jest.fn();
  });

  test("renders settings heading", () => {

    render(<AdminSettings />);

    expect(
      screen.getByText(/settings/i)
    ).toBeInTheDocument();
  });

  test("renders dark mode toggle", () => {

    render(<AdminSettings />);

    expect(
      screen.getByText(/dark mode/i)
    ).toBeInTheDocument();
  });

  test("renders notifications toggle", () => {

    render(<AdminSettings />);

    expect(
      screen.getByText(/notifications/i)
    ).toBeInTheDocument();
  });

  test("toggles dark mode ON", () => {

    render(<AdminSettings />);

    const checkboxes =
      screen.getAllByRole("checkbox");

    const darkModeToggle = checkboxes[0];

    fireEvent.click(darkModeToggle);

    expect(darkModeToggle.checked).toBe(true);

    expect(document.body.classList.contains("dark-mode"))
      .toBe(true);

    expect(localStorage.getItem("darkMode"))
      .toBe("true");
  });

  test("toggles dark mode OFF", () => {

    localStorage.setItem("darkMode", "true");

    render(<AdminSettings />);

    const checkboxes =
      screen.getAllByRole("checkbox");

    const darkModeToggle = checkboxes[0];

    fireEvent.click(darkModeToggle);

    expect(darkModeToggle.checked).toBe(false);

    expect(document.body.classList.contains("dark-mode"))
      .toBe(false);

    expect(localStorage.getItem("darkMode"))
      .toBe("false");
  });

  test("toggles notifications", () => {

    render(<AdminSettings />);

    const checkboxes =
      screen.getAllByRole("checkbox");

    const notificationToggle = checkboxes[1];

    expect(notificationToggle.checked).toBe(true);

    fireEvent.click(notificationToggle);

    expect(notificationToggle.checked).toBe(false);
  });

  test("calls alert on reset button click", () => {

    render(<AdminSettings />);

    const resetButton =
  screen.getByRole("button", {
    name: /reset/i,
  });

fireEvent.click(resetButton);

    expect(window.alert)
      .toHaveBeenCalledWith(
        "Application data reset successfully"
      );
  });

  test("clears localStorage and redirects on logout", () => {

    localStorage.setItem("token", "abc123");

    render(<AdminSettings />);

    const logoutButton =
  screen.getByRole("button", {
    name: /logout/i,
  });

fireEvent.click(logoutButton);

    expect(localStorage.getItem("token"))
      .toBe(null);

    expect(window.location.href)
      .toBe("/");
  });

});