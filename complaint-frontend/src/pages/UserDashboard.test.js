import React from "react";

import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import {
  MemoryRouter,
} from "react-router-dom";

import UserDashboard from "./UserDashboard";

// MOCK NotificationBell
jest.mock("../components/NotificationBell", () => {
  return function MockNotificationBell() {
    return <div>NotificationBell</div>;
  };
});

// MOCK Outlet
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),

  Outlet: () => (
    <div>Outlet Component</div>
  ),
}));

describe("UserDashboard Component", () => {

  beforeEach(() => {

    localStorage.setItem(
      "name",
      "Kavana"
    );

    localStorage.setItem(
      "email",
      "kavana@gmail.com"
    );

    localStorage.setItem(
      "role",
      "USER"
    );

  });

  afterEach(() => {

    localStorage.clear();

    jest.clearAllMocks();

  });

  test("renders dashboard title", () => {

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        /complaint management system/i
      )
    ).toBeInTheDocument();

  });

  test("renders navigation links", () => {

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/home/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /register complaint/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /complaint history/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /customer support/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/settings/i)
    ).toBeInTheDocument();

  });

  test("renders notification bell", () => {

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        /notificationbell/i
      )
    ).toBeInTheDocument();

  });

  test("renders outlet component", () => {

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        /outlet component/i
      )
    ).toBeInTheDocument();

  });

  test("opens profile dropdown on click", () => {

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    const profileIcon =
      screen.getByText(/👤/i);

    fireEvent.click(profileIcon);

    expect(
      screen.getByText(
        /user details/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /kavana/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /kavana@gmail.com/i
      )
    ).toBeInTheDocument();

  });

  test("closes profile dropdown on second click", () => {

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    const profileIcon =
      screen.getByText(/👤/i);

    fireEvent.click(profileIcon);

    expect(
      screen.getByText(
        /user details/i
      )
    ).toBeInTheDocument();

    fireEvent.click(profileIcon);

    expect(
      screen.queryByText(
        /user details/i
      )
    ).not.toBeInTheDocument();

  });

  test("uses localStorage values correctly", () => {

    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByText(/👤/i)
    );

    expect(
      screen.getByText(
        /kavana@gmail.com/i
      )
    ).toBeInTheDocument();

  });

});