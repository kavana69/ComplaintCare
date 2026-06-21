import React from "react";

import {
  render,
  screen,
} from "@testing-library/react";

import "@testing-library/jest-dom";

import Home from "./home";

// MOCK IMAGE
jest.mock("../../assets/bg.jpg.avif", () => {
  return "mock-image";
});

describe("Home Component", () => {

  test("renders heading correctly", () => {

    render(<Home />);

    expect(
      screen.getByText(
        /complaint management system/i
      )
    ).toBeInTheDocument();

  });

  test("renders all description paragraphs", () => {

    render(<Home />);

    expect(
      screen.getByText(
        /welcome to the complaint management system/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /users can easily raise issues/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /our goal is to provide faster resolutions/i
      )
    ).toBeInTheDocument();

  });

  test("renders image correctly", () => {

    render(<Home />);

    const image =
      screen.getByAltText(/complaint/i);

    expect(image)
      .toBeInTheDocument();

    expect(image)
      .toHaveAttribute(
        "src",
        "mock-image"
      );

  });

  test("renders main container", () => {

    const { container } = render(<Home />);

    expect(
      container.firstChild
    ).toBeInTheDocument();

  });

  test("renders exactly one image", () => {

    render(<Home />);

    const images =
      screen.getAllByRole("img");

    expect(images.length)
      .toBe(1);

  });

});