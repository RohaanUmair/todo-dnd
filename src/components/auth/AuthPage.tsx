'use client';
import { auth, createAccount, createUserWithEmailAndPassword, loginUser, signInWithEmailAndPassword } from '@/lib/firebase';
import React, { FormEvent, InputHTMLAttributes, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

function AuthPage() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [username, setUsername] = useState<string>('');

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handlePasswordChange = (e: any) => {
        const value = e?.target?.value;
        setPassword(value);

        if (value.length < 6) {
            setPasswordError('Password must be at least 6 characters long');
        } else {
            setPasswordError('');
        }
    };

    const handleEmailChange = (e: any) => {
        const value = e?.target?.value;
        setEmail(value);

        if (value.includes('@') && value.includes('.')) {
            setEmailError('');
        } else {
            setEmailError('Invalid Email');
        }
    };

    const [showLoginForm, setShowLoginForm] = useState<boolean>(true);

    const handleLoginUser = (e: FormEvent) => {
        setIsSubmitting(true);

        e.preventDefault();
        if (password.length < 6) return;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('logged in', user);

                setIsSubmitting(false);
            })
            .catch((error) => {
                const errorMessage = error.message;

                setIsSubmitting(false);

                console.log(errorMessage);

                if (errorMessage == 'Firebase: Error (auth/invalid-credential).') {
                    const notify = () => toast.error('Invalid credentials!', {
                        duration: 1000,
                        position: 'top-center',
                    });
                    notify();
                }
            });
    };

    const handleCreateAccount = (e: FormEvent) => {
        setIsSubmitting(true);

        e.preventDefault();

        if (password.length < 6) return;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('account created', user);

                setIsSubmitting(false);
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
                setIsSubmitting(false);

                if (errorMessage == 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
                    const notify = () => toast.error('Password too short!', {
                        duration: 1000,
                        position: 'top-center',
                    });
                    notify();
                } else if (errorMessage == 'Firebase: Error (auth/email-already-in-use).') {
                    const notify = () => toast.error('Email already in use!', {
                        duration: 1000,
                        position: 'top-center',
                    });
                    notify();
                } else if (errorMessage == 'Firebase: Error (auth/invalid-email).') {
                    const notify = () => toast.error('Invalid email!', {
                        duration: 1000,
                        position: 'top-center',
                    });
                    notify();
                } else {
                    const notify = () => toast.error('An error occured!', {
                        duration: 1000,
                        position: 'top-center',
                    });
                    notify();
                }
            });
    };


    const switchForm = (switchTo: 'login' | 'signup') => {
        setEmail('');
        setPassword('');

        setEmailError('');
        setPasswordError('');

        if (switchTo == 'login') {
            setShowLoginForm(true);
        } else if (switchTo == 'signup') {
            setShowLoginForm(false);
        }
    };


    return (
        <div className='h-screen w-screen text-white flex justify-center items-center bg-zinc-800'>
            {
                showLoginForm ? (
                    <form onSubmit={handleLoginUser} className="bg-zinc-900 w-96 h-fit rounded-lg flex flex-col items-center gap-4 py-4 shadow shadow-black border border-green-500">
                        <h1 className="text-center text-4xl font-semibold px-12">Login</h1>

                        <div className="w-full flex flex-col px-12 gap-1">
                            <label className="text-lg">Email</label>
                            <input
                                value={email}
                                onChange={handleEmailChange}
                                type="email"
                                className="h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600"
                            />
                            {emailError && <p className="text-red-500 text-sm my-1">{emailError}</p>}
                        </div>

                        <div className="w-full flex flex-col px-12 gap-1">
                            <label className="text-lg">Password</label>
                            <input
                                value={password}
                                onChange={handlePasswordChange}
                                type="password"
                                className="h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600"
                            />
                            {passwordError && <p className="text-red-500 text-sm my-1">{passwordError}</p>}
                        </div>

                        <button className='bg-zinc-800 w-32 h-12 text-lg rounded hover:bg-zinc-900 border border-zinc-900 hover:border-green-600' disabled={isSubmitting}>
                            {isSubmitting ? 'Logging In...' : 'Login'}
                        </button>

                        <p className='text-sm'>Dont have an account?
                            <span className='text-blue-500 cursor-pointer' onClick={() => switchForm('signup')}>  Create Account</span>
                        </p>

                    </form>
                ) : (
                    <form onSubmit={handleCreateAccount} className="bg-zinc-900 w-96 h-fit rounded-lg flex flex-col items-center gap-4 py-4 shadow shadow-black border border-green-500">
                        <h1 className='text-center text-4xl font-semibold px-12'>SignUp</h1>

                        <div className='w-full flex flex-col px-12 gap-1'>
                            <label className='text-lg'>Username</label>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                type="text"
                                className='h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600'
                            />
                        </div>

                        <div className='w-full flex flex-col px-12 gap-1'>
                            <label className='text-lg'>Email</label>
                            <input
                                value={email}
                                onChange={handleEmailChange}
                                type="email"
                                className='h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600'
                            />
                            {emailError && <p className="text-red-500 text-sm my-1">{emailError}</p>}
                        </div>

                        <div className='w-full flex flex-col px-12 gap-1'>
                            <label className='text-lg'>Password</label>
                            <input
                                value={password}
                                onChange={handlePasswordChange}
                                type="password"
                                className='h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600'
                            />
                            {passwordError && <p className="text-red-500 text-sm my-1">{passwordError}</p>}
                        </div>

                        <button className='bg-zinc-800 w-32 h-12 text-lg rounded hover:bg-zinc-900 border border-zinc-900 hover:border-rose-600' disabled={isSubmitting}>
                            {isSubmitting ? 'Signing Up...' : 'SIgnup'}
                        </button>

                        <p className='text-sm'>Already have an account?
                            <span className='text-blue-500 cursor-pointer' onClick={() => switchForm('login')}>  Login now</span>
                        </p>

                    </form>
                )
            }

            <Toaster />
        </div>
    )
}

export default AuthPage;