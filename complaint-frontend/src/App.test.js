import React from "react";

import {
  render,
  screen,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import App from "./App";

// MOCK ALL COMPONENTS

jest.mock("./pages/Login", () => () =>
  <div>Login Page</div>
);

jest.mock("./pages/Register", () => () =>
  <div>Register Page</div>
);

jest.mock("./pages/ForgotPassword", () => () =>
  <div>Forgot Password Page</div>
);

jest.mock("./pages/ResetPassword", () => () =>
  <div>Reset Password Page</div>
);

jest.mock("./pages/UserDashboard", () => () =>
  <div>User Dashboard</div>
);

jest.mock("./pages/AdminDashboard", () => () =>
  <div>Admin Dashboard</div>
);

jest.mock("./pages/user/home", () => () =>
  <div>Home Page</div>
);

jest.mock("./pages/user/Settings", () => () =>
  <div>User Settings</div>
);

jest.mock("./pages/user/ComplaintForm", () => () =>
  <div>Complaint Form</div>
);

jest.mock("./pages/user/CustomerSupport", () => () =>
  <div>Customer Support</div>
);

jest.mock("./pages/user/ComplaintHistory", () => () =>
  <div>Complaint History</div>
);

jest.mock("./pages/admin/AdminHome", () => () =>
  <div>Admin Home</div>
);

jest.mock("./pages/admin/AdminCharts", () => () =>
  <div>Admin Charts</div>
);

jest.mock("./pages/admin/AdminComplaints", () => () =>
  <div>Admin Complaints</div>
);

jest.mock("./pages/admin/UserManagement", () => () =>
  <div>User Management</div>
);

jest.mock("./pages/admin/AdminSettings", () => () =>
  <div>Admin Settings</div>
);

describe("App Component", () => {

  test("renders login route", () => {

    window.history.pushState(
      {},
      "",
      "/"
    );

    render(<App />);

    expect(
      screen.getByText(
        /login page/i
      )
    ).toBeInTheDocument();

  });

  test("renders register route", () => {

    window.history.pushState(
      {},
      "",
      "/register"
    );

    render(<App />);

    expect(
      screen.getByText(
        /register page/i
      )
    ).toBeInTheDocument();

  });

  test("renders forgot password route", () => {

    window.history.pushState(
      {},
      "",
      "/forgot-password"
    );

    render(<App />);

    expect(
      screen.getByText(
        /forgot password page/i
      )
    ).toBeInTheDocument();

  });

  test("renders reset password route", () => {

    window.history.pushState(
      {},
      "",
      "/reset-password"
    );

    render(<App />);

    expect(
      screen.getByText(
        /reset password page/i
      )
    ).toBeInTheDocument();

  });

  test("renders user dashboard route", () => {

    window.history.pushState(
      {},
      "",
      "/user"
    );

    render(<App />);

    expect(
      screen.getByText(
        /user dashboard/i
      )
    ).toBeInTheDocument();

  });

  test("renders admin dashboard route", () => {

    window.history.pushState(
      {},
      "",
      "/admin"
    );

    render(<App />);

    expect(
      screen.getByText(
        /admin dashboard/i
      )
    ).toBeInTheDocument();

  });

});