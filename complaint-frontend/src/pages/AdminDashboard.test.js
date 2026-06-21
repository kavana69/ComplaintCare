import React from "react";

import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import { MemoryRouter } from "react-router-dom";

import AdminDashboard from "./AdminDashboard";

// MOCK NotificationBell
jest.mock("../components/NotificationBell", () => {
  return function MockNotificationBell() {
    return <div>NotificationBell</div>;
  };
});

// MOCK Outlet
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Outlet: () => <div>Outlet Component</div>,
}));

describe("AdminDashboard Component", () => {

  beforeEach(() => {

    localStorage.setItem("username", "AdminUser");

    localStorage.setItem(
      "email",
      "admin@test.com"
    );
  });

  test("renders dashboard heading", () => {

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/admin dashboard/i)
    ).toBeInTheDocument();
  });

  test("renders sidebar links", () => {

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/dashboard/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/analytics/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/complaints/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/user management/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/settings/i)
    ).toBeInTheDocument();
  });

  test("renders notification bell", () => {

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/notificationbell/i)
    ).toBeInTheDocument();
  });

  test("toggles profile dropdown", () => {

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByText(/admin/i)
    );

    expect(
      screen.getByText(/admin@test.com/i)
    ).toBeInTheDocument();
  });

  test("renders outlet component", () => {

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/outlet component/i)
    ).toBeInTheDocument();
  });

});