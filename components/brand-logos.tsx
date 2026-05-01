export function BrandLogos() {
  const brands = [
    { name: "ROCCAT", svg: (
      <svg viewBox="0 0 120 40" className="h-8 w-auto" fill="currentColor">
        <text x="0" y="28" fontSize="22" fontWeight="700" fontFamily="Arial" letterSpacing="1">ROCCAT</text>
      </svg>
    )},
    { name: "MSI", svg: (
      <svg viewBox="0 0 80 40" className="h-8 w-auto" fill="currentColor">
        <text x="0" y="30" fontSize="28" fontWeight="900" fontFamily="Arial" fontStyle="italic">msi</text>
      </svg>
    )},
    { name: "RAZER", svg: (
      <svg viewBox="0 0 120 40" className="h-7 w-auto" fill="currentColor">
        <text x="0" y="28" fontSize="20" fontWeight="700" fontFamily="Arial" letterSpacing="3">RAZER</text>
      </svg>
    )},
    { name: "thermaltake", svg: (
      <svg viewBox="0 0 180 40" className="h-7 w-auto" fill="currentColor">
        <text x="0" y="28" fontSize="18" fontWeight="600" fontFamily="Arial">thermaltake</text>
      </svg>
    )},
    { name: "ADATA", svg: (
      <svg viewBox="0 0 120 40" className="h-8 w-auto" fill="currentColor">
        <text x="0" y="30" fontSize="24" fontWeight="800" fontFamily="Arial" letterSpacing="1">ADATA</text>
      </svg>
    )},
    { name: "HP", svg: (
      <svg viewBox="0 0 160 40" className="h-7 w-auto" fill="currentColor">
        <text x="0" y="26" fontSize="13" fontWeight="600" fontFamily="Arial">HEWLETT·</text>
        <text x="0" y="40" fontSize="13" fontWeight="600" fontFamily="Arial">PACKARD</text>
      </svg>
    )},
    { name: "GIGABYTE", svg: (
      <svg viewBox="0 0 160 40" className="h-7 w-auto" fill="currentColor">
        <text x="0" y="28" fontSize="20" fontWeight="800" fontFamily="Arial" letterSpacing="1">GIGABYTE</text>
      </svg>
    )},
  ];

  return (
    <div id="brands" className="scroll-mt-28 border-y border-[#e7eef6] bg-white py-6 sm:py-8">
      <div className="mx-auto grid max-w-360 grid-cols-2 items-center gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-7">
        {brands.map((brand) => (
          <div
            key={brand.name}
            title={brand.name}
            className="flex items-center justify-center text-[#bbbfc8] transition-all duration-200 hover:text-[#555] hover:scale-105 cursor-pointer"
          >
            {brand.svg}
          </div>
        ))}
      </div>
    </div>
  );
}
