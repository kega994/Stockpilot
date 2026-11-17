import React, { useContext } from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import BasketContext, { BasketProvider } from "./BasketContext";

function BasketHarness() {
  const { basket, addToBasket, increaseQuantity, decreaseQuantity } = useContext(BasketContext);
  const product = { id: 1, name: "Test item", price: 5, quantity: 2 };
  return (
    <div>
      <output aria-label="basket-count">{basket.reduce((n, item) => n + item.basketQuantity, 0)}</output>
      <button onClick={() => addToBasket(product)}>Add item</button>
      <button onClick={() => increaseQuantity(1)}>Increase</button>
      <button onClick={() => decreaseQuantity(1)}>Decrease</button>
      <output aria-label="item-quantity">{basket[0]?.basketQuantity ?? 0}</output>
    </div>
  );
}

describe("BasketProvider", () => {
  beforeEach(() => localStorage.clear());
  afterEach(cleanup);

  test("adds a product to an empty basket", () => {
    render(<BasketProvider><BasketHarness /></BasketProvider>);
    fireEvent.click(screen.getByText("Add item"));
    expect(screen.getByLabelText("basket-count")).toHaveTextContent("1");
    expect(screen.getByLabelText("item-quantity")).toHaveTextContent("1");
  });

  test("increments quantity but never exceeds available stock", () => {
    render(<BasketProvider><BasketHarness /></BasketProvider>);
    fireEvent.click(screen.getByText("Add item"));
    fireEvent.click(screen.getByText("Increase"));
    expect(screen.getByLabelText("item-quantity")).toHaveTextContent("2");
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
    fireEvent.click(screen.getByText("Increase"));
    expect(screen.getByLabelText("item-quantity")).toHaveTextContent("2");
    expect(alert).toHaveBeenCalled();
    alert.mockRestore();
  });

  test("removes an item when its quantity is decreased from one", () => {
    render(<BasketProvider><BasketHarness /></BasketProvider>);
    fireEvent.click(screen.getByText("Add item"));
    fireEvent.click(screen.getByText("Decrease"));
    expect(screen.getByLabelText("basket-count")).toHaveTextContent("0");
  });
});
