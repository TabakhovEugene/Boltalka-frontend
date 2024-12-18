import Link from 'next/link';
import Navbar from "@/app/components/Navbar";

export default function Home() {
  return (
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center bg-neutral-800">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Добро пожаловать в Baltalka</h1>
            <p className="text-lg text-gray-200 mt-4">
              Ваше место для голосового и видеосвязи с друзьями и коллегами.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/register" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition">
                  Зарегистрироваться
              </Link>
              <Link href="/login" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition">
                  Войти
              </Link>
            </div>
          </div>
        </main>
      </div>
  );
}
