export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-200"></div>
            <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    );
}

export function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-12 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-24 bg-gray-200 rounded"></div>
                </div>
            </div>
        </div>
    );
}
