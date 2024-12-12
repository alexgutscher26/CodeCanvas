export default function TemplateDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-32 bg-gray-800 rounded animate-pulse mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="h-[400px] bg-gray-800 rounded-xl animate-pulse" />
            
            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
              <div className="h-6 w-32 bg-gray-700 rounded animate-pulse mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-gray-700 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="h-8 w-64 bg-gray-800 rounded animate-pulse mb-4" />
              <div className="h-24 bg-gray-800 rounded animate-pulse" />
            </div>

            <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-24 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-700 rounded animate-pulse" />
              </div>

              <div className="space-y-4">
                <div className="h-10 bg-blue-600/50 rounded-lg animate-pulse" />
                <div className="h-4 w-48 bg-gray-700 rounded animate-pulse mx-auto" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-6 w-24 bg-gray-800 rounded animate-pulse" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-4 bg-gray-800 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
