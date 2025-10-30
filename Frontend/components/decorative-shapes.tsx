export function DecorativeShapes() {
  return (
    <div className="relative w-full h-full">
      {/* Geometric shapes */}
      <div className="absolute top-10 right-20 w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg transform rotate-12 opacity-60"></div>
      <div className="absolute top-32 right-10 w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full opacity-50"></div>
      <div className="absolute top-20 right-40 w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-200 transform rotate-45 opacity-40"></div>
      <div className="absolute top-48 right-32 w-20 h-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-full opacity-30"></div>
      <div className="absolute top-64 right-16 w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg transform -rotate-12 opacity-35"></div>
    </div>
  )
}
