import React from "react";

interface InputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  type?: "text" | "password" | "email";
  textarea?: boolean;
  selectOptions?: { value: string; label: string }[];
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  selectOptions,
  required = false,
}) => {
  return (
    <div className="mb-2">
      <label className="block mb-1 font-semibold">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required={required}
        />
      ) : selectOptions ? (
        <select
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required={required}
        >
          {selectOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="w-full p-2 border rounded"
          required={required}
        />
      )}
    </div>
  );
};

export default Input;
