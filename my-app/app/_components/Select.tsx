interface SelectProps<T> {
  label?: string;
  items: string[] | number[] | { [key: string]: string | number }[];
  onChange?: (value: T) => void;
  value?: T | null;
  loading?: boolean;
}

const termMap: { [key: string]: string } = {
  FA: "Fall",
  SP: "Spring",
  SU: "Summer",
};

// simple select component for now, generalizes object so that it can iterate through it like
// a list and ignore the key name...
// takes in a label, list of objects used to display each option, and an onChange function
// which will just be a useState and change the associated state to the selected value
export default function Select<T>({
  label, // label for select box
  items, // list of options
  onChange, // callback when selection changes
  value, // currently selected value
  loading = false, // default false
}: SelectProps<T>) {
  const isEmpty = items.length === 0 && !loading; // done loading but no items

  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <select
        className="border w-80"
        value={loading ? "" : String(value ?? "")}
        onChange={(e) => onChange?.(e.target.value as T)}
        disabled={loading} // optional: lock the select while loading
      >
        {loading ? (
          // shows while loading
          <option value="" disabled>
            Loading...
          </option>
        ) : isEmpty ? (
          // shows when there are no items
          <option value="" disabled>
            No options available
          </option>
        ) : (
          // Actual items
          items.map((item, index) => {
            let val =
              typeof item === "string" || typeof item === "number"
                ? item
                : Object.values(item)[0];
            //?? means if val is null default to index as key
            //conditional rendering if label is "Terms", map value to full term name otherwise just show value
            return (
              <option key={String(val ?? index)} value={String(val)}>
                {label === "Terms" ? termMap[String(val)] : String(val)}
              </option>
            );
          })
        )}
      </select>
    </div>
  );
}
