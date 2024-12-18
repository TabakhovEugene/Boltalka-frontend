'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useState} from 'react';
import {redirect} from "next/navigation";
import { useRouter } from 'next/navigation'
import logo from '@/img/logo.jpg';



export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();


    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Неверный email или пароль');
            }

            const { token } = await response.json();
            localStorage.setItem('token', token); // Сохраняем токен в локальное хранилище
            router.push('/servers'); // Перенаправляем пользователя на защищенную страницу
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-800">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <Link
                    href="/"
                    className="max-w-7xl mx-auto flex items-center justify-center bg-orange-400 hover:bg-orange-500 py-4 rounded-lg"
                >
                    <Image src={logo} alt="App Logo" className="w-14 h-14 mr-4 rounded-lg" />
                    <h1 className="text-4xl font-bold text-white">Baltalka</h1>
                </Link>
                <h1 className="flex justify-center text-2xl font-bold text-gray-800 my-5">Вход в аккаунт</h1>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-300"
                            placeholder="Введите ваш email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">Пароль</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-300"
                            placeholder="Введите ваш пароль"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                    >
                        Войти
                    </button>
                </form>
                <p className="text-sm text-gray-600 mt-4">
                    Еще нет аккаунта?{' '}
                    <Link href="/register" className="text-green-500 hover:underline">
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </div>
    );
}
