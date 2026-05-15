export default function CrmLoading() {
  return (
    <div className="px-6 lg:px-10 py-10 lg:py-14 max-w-[1400px]">
      <div className="animate-pulse">
        <div className="h-3 w-20 bg-cream/15 mb-4" />
        <div className="h-10 w-2/3 bg-cream/10 mb-3" />
        <div className="h-3 w-1/3 bg-cream/8 mb-12" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-cream/10 mb-14 border border-cream/10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-navy p-7">
              <div className="h-2 w-16 bg-cream/15 mb-4" />
              <div className="h-10 w-12 bg-cream/10 mb-4" />
              <div className="h-2 w-20 bg-cream/8" />
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-5">
              <div className="w-44 h-3 bg-cream/10" />
              <div className="flex-1 h-7 bg-cream/5" />
              <div className="w-10 h-3 bg-cream/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
