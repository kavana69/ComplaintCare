import React from "react";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import ComplaintForm from "./ComplaintForm";

import API from "../../api/axios";

// MOCK API
jest.mock("../../api/axios");

describe("ComplaintForm Component", () => {

  beforeEach(() => {

    jest.clearAllMocks();

    window.alert = jest.fn();

  });

  test("renders complaint form properly", () => {

    render(<ComplaintForm />);

    expect(
      screen.getByText(/register complaint/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /enter complaint title/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /describe your complaint/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /submit complaint/i,
      })
    ).toBeInTheDocument();

  });

  test("updates input fields correctly", () => {

    render(<ComplaintForm />);

    const titleInput =
      screen.getByPlaceholderText(
        /enter complaint title/i
      );

    const descriptionInput =
      screen.getByPlaceholderText(
        /describe your complaint/i
      );

    fireEvent.change(titleInput, {
      target: {
        value: "Water Leakage",
      },
    });

    fireEvent.change(descriptionInput, {
      target: {
        value: "Pipe leakage in hostel",
      },
    });

    expect(titleInput.value)
      .toBe("Water Leakage");

    expect(descriptionInput.value)
      .toBe("Pipe leakage in hostel");

  });

  test("submits complaint successfully", async () => {

    API.post.mockResolvedValueOnce({
      data: {},
    });

    render(<ComplaintForm />);

    const titleInput =
      screen.getByPlaceholderText(
        /enter complaint title/i
      );

    const descriptionInput =
      screen.getByPlaceholderText(
        /describe your complaint/i
      );

    fireEvent.change(titleInput, {
      target: {
        value: "Water Leakage",
      },
    });

    fireEvent.change(descriptionInput, {
      target: {
        value: "Pipe leakage issue",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /submit complaint/i,
      })
    );

    await waitFor(() => {

      expect(API.post).toHaveBeenCalledWith(
        "/complaints",
        {
          title: "Water Leakage",
          description: "Pipe leakage issue",
        }
      );

    });

    expect(window.alert)
      .toHaveBeenCalledWith(
        "Complaint submitted!"
      );

  });

  test("clears fields after successful submit", async () => {

    API.post.mockResolvedValueOnce({
      data: {},
    });

    render(<ComplaintForm />);

    const titleInput =
      screen.getByPlaceholderText(
        /enter complaint title/i
      );

    const descriptionInput =
      screen.getByPlaceholderText(
        /describe your complaint/i
      );

    fireEvent.change(titleInput, {
      target: {
        value: "Electricity Issue",
      },
    });

    fireEvent.change(descriptionInput, {
      target: {
        value: "Power fluctuation",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /submit complaint/i,
      })
    );

    await waitFor(() => {

      expect(titleInput.value).toBe("");
      expect(descriptionInput.value).toBe("");

    });

  });

  test("handles API error properly", async () => {

    API.post.mockRejectedValueOnce(
      new Error("API Error")
    );

    console.error = jest.fn();

    render(<ComplaintForm />);

    fireEvent.change(
      screen.getByPlaceholderText(
        /enter complaint title/i
      ),
      {
        target: {
          value: "Network Issue",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        /describe your complaint/i
      ),
      {
        target: {
          value: "WiFi not working",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /submit complaint/i,
      })
    );

    await waitFor(() => {

      expect(console.error)
        .toHaveBeenCalled();

    });

    expect(window.alert)
      .toHaveBeenCalledWith(
        "Error submitting complaint"
      );

  });

});