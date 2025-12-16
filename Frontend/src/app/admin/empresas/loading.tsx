import { Card, CardContent } from "@/src/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen admin-gradient">
      <div className="p-6">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-white/20 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-white/20 rounded w-96 animate-pulse"></div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-10 bg-white/20 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-white/20 rounded w-56 animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <Card className="bg-white/95 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="p-6 border-b">
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <th key={i} className="px-6 py-3">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Skeleton */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
