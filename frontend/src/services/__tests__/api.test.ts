import api from "@/services/api";

describe("Axios API Instance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should have correct baseURL and default headers", () => {
    expect(api.defaults.baseURL).toBe("http://localhost:5000/api");
    expect(api.defaults.headers["Content-Type"]).toBe("application/json");
  });

  test("should attach Authorization header when token exists", () => {
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue("test-token");

    const interceptor = (api.interceptors.request as any).handlers[0].fulfilled;

    const config = { headers: {} };
    const result = interceptor(config);

    expect(result.headers.Authorization).toBe("Bearer test-token");
  });

  test("should not attach Authorization header when token does not exist", () => {
    jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    const interceptor = (api.interceptors.request as any).handlers[0].fulfilled;

    const config = { headers: {} };
    const result = interceptor(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  test("should return response as-is on success", () => {
    const interceptor = (api.interceptors.response as any).handlers[0]
      .fulfilled;
    const mockResponse = { data: { success: true }, status: 200 };

    const result = interceptor(mockResponse);

    expect(result).toEqual(mockResponse);
  });
});
