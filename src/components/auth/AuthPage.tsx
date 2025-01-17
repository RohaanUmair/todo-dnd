'use client';
import { createAccount, loginUser } from '@/lib/firebase';
import React, { FormEvent, useState } from 'react';
import { Toaster } from 'react-hot-toast';

function AuthPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [showLoginForm, setShowLoginForm] = useState<boolean>(true);

    const handleLoginUser = (e: FormEvent) => {
        e.preventDefault();
        loginUser(email, password);
    };

    const handleCreateAccount = (e: FormEvent) => {
        e.preventDefault();
        createAccount(email, password);
    };

    return (
        <div className='h-screen w-screen text-white flex justify-center items-center bg-zinc-800'>
            {
                showLoginForm ? (
                    <form onSubmit={handleLoginUser} className='bg-zinc-900 w-96 h-[350px] rounded-lg flex flex-col items-center justify-evenly shadow shadow-black border border-green-500'>


                        <h1 className='text-center text-4xl font-semibold px-12'>Login</h1>

                        <div className='w-full flex flex-col px-12 gap-1'>
                            <label className='text-lg'>Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className='h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600'
                            />
                        </div>

                        <div className='w-full flex flex-col px-12 gap-1'>
                            <label className='text-lg'>Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className='h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600'
                            />
                        </div>

                        <button className='bg-zinc-800 w-32 h-12 text-lg rounded hover:bg-zinc-900 border border-zinc-900 hover:border-green-600'>Login</button>

                        <p className='text-sm'>Dont have an account?
                            <span className='text-blue-500 cursor-pointer' onClick={() => setShowLoginForm(false)}>  Create Account</span>
                        </p>

                    </form>
                ) : (
                    <form onSubmit={handleCreateAccount} className='bg-zinc-900 w-96 h-[350px] rounded-lg flex flex-col items-center justify-evenly shadow shadow-black border border-rose-500'>


                        <h1 className='text-center text-4xl font-semibold px-12'>SignUp</h1>

                        <div className='w-full flex flex-col px-12 gap-1'>
                            <label className='text-lg'>Email</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                className='h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600'
                            />
                        </div>

                        <div className='w-full flex flex-col px-12 gap-1'>
                            <label className='text-lg'>Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className='h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600'
                            />
                        </div>

                        <button className='bg-zinc-800 w-32 h-12 text-lg rounded hover:bg-zinc-900 border border-zinc-900 hover:border-rose-600'>SignUp</button>

                        <p className='text-sm'>Already have an account?
                            <span className='text-blue-500 cursor-pointer' onClick={() => setShowLoginForm(true)}>  Login now</span>
                        </p>

                    </form>
                )
            }

            <Toaster />
        </div>
    )
}

export default AuthPage;