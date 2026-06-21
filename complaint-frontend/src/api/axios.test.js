import API from "./axios";

describe("API Axios Interceptor", () => {

  beforeEach(() => {

    localStorage.clear();

  });

  test("adds token for protected routes", () => {

    localStorage.setItem(
      "token",
      "abc123"
    );

    const request = {
      url: "/complaints",
      headers: {},
    };

    const interceptor =
      API.interceptors.request.handlers[0]
        .fulfilled;

    const result =
      interceptor(request);

    expect(
      result.headers.Authorization
    ).toBe("Bearer abc123");

  });

  test("does not add token for send otp route", () => {

    localStorage.setItem(
      "token",
      "abc123"
    );

    const request = {
      url: "/users/send-otp",
      headers: {},
    };

    const interceptor =
      API.interceptors.request.handlers[0]
        .fulfilled;

    const result =
      interceptor(request);

    expect(
      result.headers.Authorization
    ).toBeUndefined();

  });

  test("does not add token for verify register route", () => {

    localStorage.setItem(
      "token",
      "abc123"
    );

    const request = {
      url: "/users/verify-register",
      headers: {},
    };

    const interceptor =
      API.interceptors.request.handlers[0]
        .fulfilled;

    const result =
      interceptor(request);

    expect(
      result.headers.Authorization
    ).toBeUndefined();

  });

  test("does not add token for login route", () => {

    localStorage.setItem(
      "token",
      "abc123"
    );

    const request = {
      url: "/auth/login",
      headers: {},
    };

    const interceptor =
      API.interceptors.request.handlers[0]
        .fulfilled;

    const result =
      interceptor(request);

    expect(
      result.headers.Authorization
    ).toBeUndefined();

  });

  test("does not add token for forgot password routes", () => {

    localStorage.setItem(
      "token",
      "abc123"
    );

    const request = {
      url:
        "/users/forgot-password/send-otp",
      headers: {},
    };

    const interceptor =
      API.interceptors.request.handlers[0]
        .fulfilled;

    const result =
      interceptor(request);

    expect(
      result.headers.Authorization
    ).toBeUndefined();

  });

  test("does not add token for chatbot route", () => {

    localStorage.setItem(
      "token",
      "abc123"
    );

    const request = {
      url: "/chatbot/message",
      headers: {},
    };

    const interceptor =
      API.interceptors.request.handlers[0]
        .fulfilled;

    const result =
      interceptor(request);

    expect(
      result.headers.Authorization
    ).toBeUndefined();

  });

  test("does not add token when token is missing", () => {

    const request = {
      url: "/complaints",
      headers: {},
    };

    const interceptor =
      API.interceptors.request.handlers[0]
        .fulfilled;

    const result =
      interceptor(request);

    expect(
      result.headers.Authorization
    ).toBeUndefined();

  });

  test("returns request object correctly", () => {

    const request = {
      url: "/complaints",
      headers: {},
    };

    const interceptor =
      API.interceptors.request.handlers[0]
        .fulfilled;

    const result =
      interceptor(request);

    expect(result)
      .toEqual(request);

  });

});