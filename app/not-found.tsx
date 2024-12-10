import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-[500px] bg-gray-100">
            <div className="text-center">
                <h2 className="text-6xl font-bold text-red-500">404</h2>
                <h3 className="text-2xl font-semibold text-gray-800 mt-4">Không tìm thấy trang</h3>
                <p className="text-gray-600 mt-2">
                    Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm.
                </p>
                <Link
                    href="/"
                    className="inline-block mt-6 px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
                >
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
}
