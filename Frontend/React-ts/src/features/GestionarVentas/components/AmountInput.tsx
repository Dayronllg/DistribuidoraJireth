import React, { useState } from "react";
import "./AmountInput.css";

export default function AmountInput() {
  const [amount, setAmount] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Permitir números positivos, punto decimal y hasta 1 punto
    if (/^(\d+\.?\d*|\.\d*)?$/.test(value)) {
      setAmount(value);
    }
  };

  const handleBlur = () => {
    if (amount === "") return;

    const numberValue = parseFloat(amount);

    if (!isNaN(numberValue)) {
      const rounded = Math.max(0, numberValue); // evitar negativos
      setAmount(rounded.toFixed(2));
    } else {
      setAmount("");
    }
  };

  return (
    <div className="form-group">
      <label className="form-label" htmlFor="amount">
        TOTAL
      </label>
      <div className="input-wrapper">
        <span>C$</span>
        <input
          type="text"
          id="total"
          name="Total"
          value={amount}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Precio total"
          inputMode="decimal"
        />
      </div>
    </div>
  );
}
