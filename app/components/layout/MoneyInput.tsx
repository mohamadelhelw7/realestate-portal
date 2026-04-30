import { useState, useEffect } from "react";
import { formatMoney, parseMoney } from "~/lib/format";

interface Props {
  name: string;
  defaultValue?: number | null;
  required?: boolean;
  placeholder?: string;
  className?: string;
  onChange?: (value: number | null) => void;
}

export function MoneyInput({
  name,
  defaultValue,
  required,
  placeholder,
  className,
  onChange,
}: Props) {
  const [display, setDisplay] = useState(formatMoney(defaultValue));

  useEffect(() => {
    setDisplay(formatMoney(defaultValue));
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseMoney(e.target.value);
    if (raw === "") {
      setDisplay("");
      onChange?.(null);
      return;
    }
    if (!/^\d+$/.test(raw)) return; // only digits
    setDisplay(formatMoney(raw));
    onChange?.(Number(raw));
  };

  return (
    <>
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onChange={handleChange}
        required={required}
        placeholder={placeholder}
        className={className}
      />
      {/* Hidden field submits the raw numeric string */}
      <input type="hidden" name={name} value={parseMoney(display)} />
    </>
  );
}
