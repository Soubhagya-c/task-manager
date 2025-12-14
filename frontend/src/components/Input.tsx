interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  type = "text",
  value,
  onChange,
}: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
      />
    </div>
  );
}
