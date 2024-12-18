import Link from 'next/link';
import Image from "next/image";
import logo from "@/img/logo.jpg";


export default function Register() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-800">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <Link href="/" className="max-w-7xl mx-auto flex items-center justify-center bg-orange-400 hover:bg-orange-500 py-4 rounded-lg">
                    <Image src={logo} alt="App Logo" className="w-14 h-14 mr-4 rounded-lg"/>
                    <h1 className="text-4xl font-bold text-white">Baltalka</h1>
                </Link>
                <h1 className="flex justify-center text-2xl font-bold text-gray-800 my-5">Регистрация нового аккаунта</h1>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Имя пользователя</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Введите ваше имя"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Введите ваш email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Пароль</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Введите ваш пароль"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        Зарегистрироваться
                    </button>
                </form>
                <p className="text-sm text-gray-600 mt-4">
                    Уже есть аккаунт?{' '}
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
}
