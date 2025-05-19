import React from 'react';  
import { useRouter } from 'next/navigation';  

export default function AuthModal({ isOpen, onClose }) {  
    const router = useRouter();  

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!isOpen) return null;  

    const handleSubmit = async (e) => {
        e.preventDefault();  
        setError('');

        try {
            const response = await fetch(`${apiUrl}/api/auth/login`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }

            localStorage.setItem('token', data.token);
            console.log('Đăng nhập thành công:', data.user);

            // Đóng modal và chuyển hướng
            onClose(); // Đóng modal
            router.replace('/Overview'); // Chuyển hướng đến trang Overview

        } catch (err) {
            setError(err.message); 
            console.error('Lỗi đăng nhập:', err.message);
        }
    };  

    return (  
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">  
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">  
                <button  
                    onClick={onClose}  
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"  
                >  
                    &times;  
                </button>  
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-400">Login / Sign Up</h2>  
                <form className="space-y-4" onSubmit={handleSubmit}>  
                    <input  
                        type="text"  
                        placeholder="Username"  
                        className="w-full px-4 py-2 border rounded-lg text-gray-400"  
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                    />  
                    <input  
                        type="password"  
                        placeholder="Password"  
                        className="w-full px-4 py-2 border rounded-lg text-gray-400"  
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    {error && <div className="text-red-500 text-sm">{error}</div>}  
                    <button  
                        type="submit"  
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"  
                    >  
                        Submit  
                    </button>  
                </form>  
            </div>  
        </div>  
    );  
}
