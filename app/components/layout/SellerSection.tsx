export function SellerSection() {
  return (
    <div className="border border-gray-300 bg-white">
      <div className="px-4 py-2.5 bg-gray-100 border-b border-gray-300 text-sm font-medium text-gray-700">
        Seller details
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">First Name *</label>
            <input
              name="sellerFirstName"
              required
              className="border border-gray-300 px-3 py-2 text-sm"
              placeholder="e.g. Mohamed"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Last Name *</label>
            <input
              name="sellerLastName"
              required
              className="border border-gray-300 px-3 py-2 text-sm"
              placeholder="e.g. Hassan"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">Phone *</label>
            <input
              name="sellerPhoneNumber"
              required
              className="border border-gray-300 px-3 py-2 text-sm"
              placeholder="e.g. 01012345678"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
