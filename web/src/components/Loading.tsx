export default function Loading() {
  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 w-full py-8 md:py-12">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3 w-10 bg-rose-100 rounded animate-pulse" />
        <div className="h-3 w-3 bg-rose-100 rounded animate-pulse" />
        <div className="h-3 w-16 bg-rose-100 rounded animate-pulse" />
      </div>

      <div className="mb-10 pb-3 border-b border-gray-200">
        <div className="h-9 w-56 bg-rose-100 rounded animate-pulse" />
        <div className="h-4 w-72 bg-rose-100 rounded animate-pulse mt-3" />
        <div className="h-3 w-24 bg-rose-100 rounded animate-pulse mt-3" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-white rounded-xl overflow-hidden shadow-sm"
          >
            <div className="aspect-square w-full bg-rose-100 animate-pulse" />
            <div className="p-5 flex flex-col gap-2">
              <div className="h-3 w-16 bg-rose-100 rounded animate-pulse" />
              <div className="h-5 w-3/4 bg-rose-100 rounded animate-pulse" />
              <div className="h-3 w-20 bg-rose-100 rounded animate-pulse mt-1" />
              <div className="h-4 w-14 bg-rose-100 rounded animate-pulse mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}