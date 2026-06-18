export interface SSProduct {
  sku: string;
  title: string;
  price: number;
  qty: number;
}

export async function getProductBySku(
  sku: string
): Promise<SSProduct | null> {
  try {
    console.log("Checking S&S SKU:", sku);

    // Yahan baad mein real S&S API call ayegi

    return {
      sku,
      title: "Sample Product",
      price: 8.99,
      qty: 120,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}