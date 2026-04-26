export interface SearchInterface {
  searchValue: string;
  handleSearch: (e: any) => void;
}

export default function SearchBar({
  searchValue,
  handleSearch,
}: SearchInterface) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchValue}
        onChange={handleSearch}
        placeholder="Search by ID, title, city, phase..."
        className="w-full border border-gray-300 px-3 py-2 text-sm max-w-sm"
      />
    </div>
  );
}
