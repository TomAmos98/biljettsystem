import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";

test("visar rubriken Biljettsystem", async () => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => [],
  });

  render(<App />);

  const heading = screen.getByText("Biljettsystem");

  expect(heading).toBeInTheDocument();
});