'use client';

import { useState, useEffect } from 'react';

export default function Servers() {
    const [servers, setServers] = useState([]);
    const [currentServer, setCurrentServer] = useState(null);
    const [currentChannel, setCurrentChannel] = useState(null); // Состояние для текущего текстового канала
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [currentVoiceChannel, setCurrentVoiceChannel] = useState(null); // Состояние для голосового канала
    const [activeUsers, setActiveUsers] = useState([]); // Активные пользователи в голосовом канале

    // Эмуляция активности пользователей в голосовом канале
    useEffect(() => {
        if (!currentVoiceChannel) return;

        const interval = setInterval(() => {
            const randomActiveUsers =
                currentServer?.Users?.length > 0
                    ? currentServer.Users.filter(() => Math.random() > 0.7) // 30% вероятности
                    : [];
            setActiveUsers(randomActiveUsers);
        }, 1000);

        return () => clearInterval(interval);
    }, [currentVoiceChannel, currentServer]);

    // Загрузка серверов
    useEffect(() => {
        const fetchServers = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/servers', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке серверов');
                }
                const data = await response.json();
                setServers(data.servers);
                const firstServer = data.servers[0];
                setCurrentServer(firstServer);
                setCurrentChannel(firstServer?.TextChannels?.[0] || null);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchServers();
    }, []);

    // Загрузка сообщений для текстового канала
    useEffect(() => {
        const fetchMessages = async () => {
            if (!currentChannel) return;

            try {
                const response = await fetch(
                    `http://localhost:8000/api/servers/${currentServer.server_id}/text_channels/${currentChannel.text_id}/messages`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке сообщений');
                }
                const data = await response.json();
                setMessages(data.messages);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchMessages();
    }, [currentChannel]);

    const sendMessage = async (content) => {
        if (!currentChannel || !content) return;

        try {
            const response = await fetch(
                `http://localhost:8000/api/servers/${currentServer.server_id}/text_channels/${currentChannel.text_id}/messages/create`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ message: content }),
                }
            );

            if (!response.ok) {
                throw new Error('Ошибка при отправке сообщения');
            }

            const newMessage = await response.json();
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch (err) {
            setError(err.message);
        }
    };

    const joinVoiceChannel = (channel) => {
        setCurrentVoiceChannel(channel);
        setCurrentChannel(null); // Сброс текстового канала
        setActiveUsers([]);
    };

    const leaveVoiceChannel = () => {
        setCurrentVoiceChannel(null);
        setActiveUsers([]);
    };

    if (error) {
        return <p className="text-red-500 text-center mt-4">Ошибка: {error}</p>;
    }

    return (
        <div className="flex min-h-screen bg-gray-800 text-white">
            {/* Левая колонка - список серверов */}
            <div className="w-1/6 bg-gray-900 p-4">
                <h2 className="text-lg font-bold mb-4">Сервера</h2>
                <ul>
                    {servers.map((server) => (
                        <li
                            key={server.server_id}
                            onClick={() => {
                                setCurrentServer(server);
                                setCurrentChannel(server?.TextChannels?.[0] || null);
                                setCurrentVoiceChannel(null); // Сброс голосового канала
                            }}
                            className={`p-2 rounded cursor-pointer ${
                                currentServer?.server_id === server.server_id
                                    ? 'bg-gray-700'
                                    : 'hover:bg-gray-700'
                            }`}
                        >
                            {server.title}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Центральная колонка */}
            <div className="flex-1 flex flex-col">
                {/* Верхняя часть - название текущего сервера */}
                <div className="bg-gray-700 p-4">
                    <h2 className="text-xl font-bold">
                        {currentServer ? currentServer.title : 'Выберите сервер'}
                    </h2>
                </div>

                {/* Основное содержимое: текстовый или голосовой канал */}
                <div className="flex-1 flex">
                    <div className="w-1/5 bg-gray-900 p-4 overflow-y-auto">
                        <h3 className="text-lg font-bold mb-2">Текстовые каналы</h3>
                        {currentServer?.TextChannels?.length > 0 ? (
                            currentServer.TextChannels.map((channel) => (
                                <p
                                    key={channel.text_id}
                                    onClick={() => {
                                        setCurrentChannel(channel);
                                        setCurrentVoiceChannel(null); // Сброс голосового канала
                                    }}
                                    className={`p-2 rounded cursor-pointer ${
                                        currentChannel?.text_id === channel.text_id
                                            ? 'bg-gray-700'
                                            : 'hover:bg-gray-700'
                                    }`}
                                >
                                    # {channel.name}
                                </p>
                            ))
                        ) : (
                            <p className="text-gray-500">Нет текстовых каналов</p>
                        )}
                        <h3 className="text-lg font-bold mt-4 mb-2">Голосовые каналы</h3>
                        {currentServer?.VoiceChannels?.length > 0 ? (
                            currentServer.VoiceChannels.map((channel) => (
                                <p
                                    key={channel.voice_id}
                                    onClick={() => joinVoiceChannel(channel)}
                                    className={`p-2 rounded cursor-pointer ${
                                        currentVoiceChannel?.voice_id === channel.voice_id
                                            ? 'bg-green-500'
                                            : 'hover:bg-gray-700'
                                    }`}
                                >
                                    🔊 {channel.name}
                                </p>
                            ))
                        ) : (
                            <p className="text-gray-500">Нет голосовых каналов</p>
                        )}
                    </div>

                    {/* Основная область: чат или голосовой канал */}
                    <div className="flex-1 bg-gray-800 p-4 flex flex-col">
                        {currentChannel && (
                            <>
                                <div className="flex-1 bg-gray-900 rounded p-4 overflow-y-auto" style={{maxHeight: '490px'}}>
                                    {messages.length > 0 ? (
                                        messages.map((msg) => (
                                            <div
                                                key={msg.message_id}
                                                className={`flex mb-2 ${
                                                    msg?.user?.user_id === msg.my_user ? 'justify-end' : 'justify-start'
                                                }`}
                                            >
                                                <div
                                                    className={`p-2 rounded ${
                                                        msg?.user?.user_id === msg.my_user
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-700 text-gray-200'
                                                    }`}
                                                >
                                                    <p className="text-sm font-bold">{msg?.user?.username}</p>
                                                    <p>{msg.message}</p>
                                                    <p className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center">Сообщений нет</p>
                                    )}
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Написать сообщение..."
                                        className="w-full p-2 rounded bg-gray-700 text-white"
                                    />
                                    <button
                                        onClick={() => {
                                            if (newMessage.trim()) {
                                                sendMessage(newMessage);
                                                setNewMessage('');
                                            }
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white"
                                    >
                                        Отправить
                                    </button>
                                </div>
                            </>
                        )}
                        {currentVoiceChannel && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">
                                    В голосовом канале: {currentVoiceChannel.name}
                                </h2>
                                <div className="flex flex-col gap-2">
                                    {currentServer?.Users?.map((user) => (
                                        <div
                                            key={user.user_id}
                                            className={`p-2 rounded flex items-center gap-2 ${
                                                activeUsers.includes(user)
                                                    ? 'border-2 border-green-500'
                                                    : ''
                                            }`}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                                            <p>{user.username}</p>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={leaveVoiceChannel}
                                    className="mt-4 bg-red-600 hover:bg-red-700 p-2 rounded text-white"
                                >
                                    Покинуть канал
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Правая колонка - список участников */}
                    <div className="w-1/5 bg-gray-900 p-4 overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">Участники</h3>
                        {currentServer?.Users?.length > 0 ? (
                            currentServer.Users.map((user) => (
                                <div key={user.user_id} className="p-2 rounded hover:bg-gray-700">
                                    <p className="font-bold">{user.username}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">Нет участников</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
