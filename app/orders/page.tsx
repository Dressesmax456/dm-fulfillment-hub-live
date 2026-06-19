"use client";

import { useState } from "react";
import Papa from "papaparse";
import { getProductBySku } from "../lib/ss-api";
import FluxLayout from "../components/FluxLayout";

export default function OrdersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orderType, setOrderType] = useState("");
const [orderResult, setOrderResult] = useState("");

  const totalOrders = rows.length;

  const filteredRows = rows.filter((row) =>
    JSON.stringify(row)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const extractBaseSku = (sku: string) => {
  if (!sku) return "N/A";

  const match = sku.match(/B[A-Z0-9]{7,12}/i);

  if (!match) {
    return "Review";
  }

  return match[0];
};

  const getOrderStatus = (sku: string) => {
    const parsedSku = extractBaseSku(sku);

    if (
      parsedSku === "Review" ||
      parsedSku === "N/A"
    ) {
      return "Review";
    }

    return "Ready";
  };

  const handleFile = (file: File) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => {

      const allowedColumns = [
        "order-id",
        "product-name",
        "sku",
        "quantity-purchased",
        "recipient-name",
        "ship-address-1",
        "ship-city",
        "ship-state",
        "ship-postal-code",
        "is-buyer-requested-cancellation",
      ];

      const cleaned = (result.data as any[]).map((row) => {
        const filtered: any = {};

        allowedColumns.forEach((col) => {
          filtered[col] = row[col] || "";
        });

        return filtered;
      });


      const grouped: any = {};


      cleaned.forEach((row) => {

        const id = row["order-id"];


        if (!grouped[id]) {

          grouped[id] = {
  ...row,
  skus: [],
  quantities: [],
};
        }


       if (row["sku"]) {

  grouped[id].skus.push(row["sku"]);

  grouped[id].quantities.push(
    Number(row["quantity-purchased"]) || 1
  );

}

      });


      const finalRows = Object.values(grouped).map(
        (order: any) => ({
          ...order,
          sku: order.skus.join(", "),
        })
      );


      setRows(finalRows);

    },
  });
};

      // 🔥 GROUP BY ORDER ID
      const prepareSSOrder = (
  order: any,
  dropship: boolean
) => {

  const orderLines = (order.skus || []).map(
    (sku: string, index: number) => ({
      identifier: extractBaseSku(sku),
      qty: order.quantities?.[index] || 1,
    })
  );

  return {
  poNumber: order["order-id"],

  shippingMethod: "1",

  autoselectWarehouse: true,

  testOrder: true,

  shippingAddress: {
      customer: order["recipient-name"],
      address: order["ship-address-1"],
      city: order["ship-city"],
      state: order["ship-state"],
      zip: order["ship-postal-code"],
    },

    lines: orderLines,
  };
};

  return (
  <FluxLayout>
    <div
      style={{
        padding: "30px",
        color: "#FFFFFF",
        minHeight: "100vh",
        width: "100%",
      }}
>
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "20px",
        }}
      >
        Amazon CSV Import
      </h1>

      {/* Orders Card */}
      <div
  className="
    bg-slate-900/70
    border
    border-slate-800
    rounded-2xl
    p-6
    w-80
    backdrop-blur-xl
    shadow-lg
    mb-5
  "
>
        <div className="text-slate-400 text-sm">
  Total Imported Orders
</div>

        <div className="text-4xl font-bold mt-3">
  {totalOrders}
</div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search Order ID, SKU, Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #242424",
            background: "#171717",
            color: "white",
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
  <label
    style={{
      background: "#22C55E",
      color: "white",
      padding: "12px 20px",
      borderRadius: "10px",
      cursor: "pointer",
      display: "inline-block",
      fontWeight: "bold",
    }}
  >
    Upload CSV

    <input
      type="file"
      accept=".csv"
      style={{ display: "none" }}
      onChange={(e) => {
        const file = e.target.files?.[0];

        if (file) {
          handleFile(file);
        }
      }}
    />
  </label>
</div>

      {rows.length > 0 && (
  <div
    style={{
      marginBottom: "20px",
      display: "flex",
      gap: "10px",
    }}
  >

    <button
      onClick={async () => {
        const ordersToPlace = rows.filter(
          (row) =>
            selectedOrders.includes(row["order-id"])
        );

        console.log(
          "Direct Ship Orders",
          ordersToPlace
        );
        console.log(
  "SS PAYLOAD",
  prepareSSOrder(
    ordersToPlace[0],
    true
  )
);

        const response = await fetch(
  "/api/ss/orders",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      prepareSSOrder(
        ordersToPlace[0],
        true
      )
    ),
  }
);

const data = await response.json();

alert(
  JSON.stringify(data, null, 2)
);
      }}
      style={{
        background: "#22C55E",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Direct Ship to Customer
    </button>


    <button
      onClick={async () => {
        const ordersToPlace = rows.filter(
          (row) =>
            selectedOrders.includes(row["order-id"])
        );

        console.log(
  "SS PICKUP PAYLOAD",
  prepareSSOrder(
    ordersToPlace[0],
    false
  )
);

        const response = await fetch(
  "/api/ss/orders",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      prepareSSOrder(
        ordersToPlace[0],
        true
      )
    ),
  }
);

const data = await response.json();

alert(
  JSON.stringify(data, null, 2)
);
      }}
      style={{
        background: "#F59E0B",
        color: "white",
        border: "none",
        padding: "12px 20px",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Pickup
    </button>


  </div>
)}
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={async () => {
            const product =
              await getProductBySku("B00060706");

            alert(
              JSON.stringify(product, null, 2)
            );
          }}
          style={{
            background: "#00A3FF",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Test S&S API
        </button>
      </div>

      {/* Table */}
      {rows.length > 0 && (
        <table
          style={{
            width: "100%",
            marginTop: "20px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th
  style={{
    border: "1px solid #444",
    padding: "8px",
  }}
>
  <input
    type="checkbox"
    checked={
      filteredRows.length > 0 &&
      selectedOrders.length === filteredRows.length
    }
    onChange={(e) => {
  if (e.target.checked) {
    setSelectedOrders(
      filteredRows.map(
        (row) => row["order-id"]
      )
    );
  } else {
    setSelectedOrders([]);
  }
}}
  />
</th>
              {Object.keys(rows[0])
  .filter(
    (key) =>
      key !==
      "is-buyer-requested-cancellation"
  )
  .map((key) => (
    <th
      key={key}
                  style={{
                    border: "1px solid #444",
                    padding: "8px",
                  }}
                >
                  {key}
                </th>
              ))}

              <th
                style={{
                  border: "1px solid #444",
                  padding: "8px",
                }}
              >
                Status
              </th>

              <th
                style={{
                  border: "1px solid #444",
                  padding: "8px",
                }}
              >
                Parsed SKU
              </th>

            </tr>
          </thead>

          <tbody>
            {filteredRows.map((row, index) => (
              <tr
  key={index}
  style={{
    background:
      String(
        row[
          "is-buyer-requested-cancellation"
        ]
      ).toLowerCase() === "true"
        ? "#FFE4E6"
        : "transparent",
  }}
>
  <td
  style={{
    border: "1px solid #444",
    padding: "8px",
  }}
>
  <input
    type="checkbox"
    checked={selectedOrders.includes(row["order-id"])}
    onChange={(e) => {
  const orderId = row["order-id"];

  if (e.target.checked) {
    setSelectedOrders([
      ...selectedOrders,
      orderId,
    ]);
  } else {
    setSelectedOrders(
      selectedOrders.filter(
        (id) => id !== orderId
      )
    );
  }
}}
  />
</td>
                {Object.entries(row)
  .filter(
    ([key]) =>
      key !==
      "is-buyer-requested-cancellation"
  )
  .map(([key, value], i) => (
    <td
      key={i}
      style={{
        border: "1px solid #444",
        padding: "8px",
        color: "white",
      }}
    >
      {String(value)}
    </td>
  ))}

                <td
                  style={{
                    border: "1px solid #444",
                    padding: "8px",
                    color:
                      getOrderStatus(
                        String(
                          row["sku"] || ""
                        )
                      ) === "Ready"
                        ? "#22C55E"
                        : "#F59E0B",
                    fontWeight: "bold",
                  }}
                >
                  {getOrderStatus(
                    String(
  row["sku"] ||
  row["SKU"] ||
  row["Merchant SKU"] ||
  row["seller-sku"] ||
  row["merchant-sku"] ||
  Object.values(row)[0] ||
  ""
)
                  )}
                </td>

                <td
  style={{
    border: "1px solid #444",
    padding: "8px",
    color: "#00A3FF",
    fontWeight: "bold",
  }}
>
  {extractBaseSku(
  String(row.sku || "")
)}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
        </div>
  </FluxLayout>
  );
}