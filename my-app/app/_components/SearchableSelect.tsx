import { useState, useMemo, useEffect } from "react";

interface SearchableSelectProps<T> {
  label?: string;
  items: T[];
  value: T;
  onChange: (value: T) => void;
  getOptionText?: (item: T) => string;
}

export default function SearchableSelect<T>({
  label, // label for search box
  items, // full list of items to select from
  value, // currently selected value
  onChange, // callback when selection changes
  getOptionText = (item) => String(item), // optional formatting function, defaults to string conversion
}: SearchableSelectProps<T>) {
  const [search, setSearch] = useState("");

  // filters list based on search
  const filteredItems = useMemo(() => {
    if (!search) return items;
    return items.filter((item) =>
      getOptionText(item).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, items]);

  return (
    <div className="flex flex-col gap-2 relative w-80">
      {label && <label>{label}</label>}
      {/* Search bar */}
      <input
        className="border px-2 py-1"
        placeholder={`Search ${label?.toLowerCase()}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* Options list */}
      <select
        className="border px-2 py-1 mt-1"
        size={5}
        value={value ? getOptionText(value) : ""}
        onChange={() => {}}
      >
        {filteredItems.length === 0 ? (
          <option disabled>No matches</option>
        ) : (
          filteredItems.map((item, index) => (
            <option
              key={index}
              value={getOptionText(item)}
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(item); // handles selection, accounts for first item selection issue
              }}
            >
              {getOptionText(item)}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
