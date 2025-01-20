'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';

function AuthPage() {
    const [showLoginForm, setShowLoginForm] = useState<boolean>(true);

    const switchForm = (switchTo: 'login' | 'signup', resetForm: any) => {
        if (switchTo === 'login') {
            setShowLoginForm(true);
            resetForm({ values: { loginEmail: '', loginPassword: '' } });
        } else if (switchTo === 'signup') {
            setShowLoginForm(false);
            resetForm({ values: { signupEmail: '', signupPassword: '', signupUsername: '' } });
        }
    };


    return (
        showLoginForm ? (
            <Formik
                initialValues={{ loginEmail: '', loginPassword: '' }}
                validationSchema={Yup.object({
                    loginEmail: Yup.string().email('Invalid email address').required('Required'),
                    loginPassword: Yup.string()
                        .max(20, 'Must be 20 characters or less')
                        .required('Required')
                        .min(6, 'Must be 6 characters or more'),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        signInWithEmailAndPassword(auth, values.loginEmail, values.loginPassword)
                            .then((userCredential) => {
                                const user = userCredential.user;
                                console.log('logged in', user);
                                setSubmitting(false);
                            })
                            .catch((error) => {
                                const errorMessage = error.message;

                                if (errorMessage == 'Firebase: Error (auth/invalid-credential).') {
                                    const notify = () => toast.error('Invalid credentials!', {
                                        duration: 1000,
                                        position: 'top-center',
                                    });
                                    notify();
                                }
                                setSubmitting(false);
                            });

                    }, 400);
                }}
            >
                {({ resetForm, isSubmitting }) => (
                    <div className='h-screen w-screen text-white flex justify-center items-center bg-zinc-800'>
                        <Form className="bg-zinc-900 w-96 h-fit rounded-lg flex flex-col items-center gap-4 py-4 shadow shadow-black border border-green-500">
                            <h1 className="text-center text-4xl font-semibold px-12">Login</h1>

                            <div className="w-full flex flex-col px-12 gap-1">
                                <label htmlFor='loginEmail' className="text-lg">Email</label>
                                <Field name="loginEmail" type="email" className="h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600" />
                                <div className="text-red-700 text-sm my-1">
                                    <ErrorMessage name="loginEmail" />
                                </div>
                            </div>

                            <div className="w-full flex flex-col px-12 gap-1">
                                <label htmlFor='loginPassword' className="text-lg">Password</label>
                                <Field name="loginPassword" type="password" className="h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600" />
                                <div className="text-red-700 text-sm my-1">
                                    <ErrorMessage name="loginPassword" />
                                </div>
                            </div>

                            <button className='bg-zinc-800 w-32 h-12 text-lg rounded hover:bg-zinc-900 border border-zinc-900 hover:border-green-600' type="submit">
                                {isSubmitting ? (
                                    <SyncLoader className='mx-auto' size={10} color='#fff' />
                                ) : (
                                    'Login'
                                )}
                            </button>

                            <p className='text-sm'>Dont have an account?
                                <span className='text-blue-500 cursor-pointer' onClick={() => switchForm('signup', resetForm)}>  Create Account</span>
                            </p>
                        </Form>
                        <Toaster />
                    </div>
                )}
            </Formik>
        ) : (
            <Formik
                initialValues={{ signupEmail: '', signupPassword: '', signupUsername: '' }}
                validationSchema={Yup.object({
                    signupEmail: Yup.string().email('Invalid email address').required('Required'),
                    signupPassword: Yup.string()
                        .max(20, 'Must be 20 characters or less')
                        .required('Required')
                        .min(6, 'Must be 6 characters or more'),
                    signupUsername: Yup.string(),
                })}
                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        createUserWithEmailAndPassword(auth, values.signupEmail, values.signupPassword)
                            .then((userCredential) => {
                                const user = userCredential.user;
                                console.log('account created', user);
                                setSubmitting(false);
                            })
                            .catch((error) => {
                                const errorMessage = error.message;
                                console.log(errorMessage);

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
                                setSubmitting(false);
                            });
                    }, 400);
                }}
            >
                {({ resetForm, isSubmitting }) => (
                    <div className='h-screen w-screen text-white flex justify-center items-center bg-zinc-800'>
                        <Form className="bg-zinc-900 w-96 h-fit rounded-lg flex flex-col items-center gap-4 py-4 shadow shadow-black border border-green-500">
                            <h1 className="text-center text-4xl font-semibold px-12">Signup</h1>

                            <div className="w-full flex flex-col px-12 gap-1">
                                <label htmlFor='signupUsername' className="text-lg">Username</label>
                                <Field name="signupUsername" type="text" className="h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600" />
                                <div className="text-red-700 text-sm my-1">
                                    <ErrorMessage name="signupUsername" />
                                </div>
                            </div>

                            <div className="w-full flex flex-col px-12 gap-1">
                                <label htmlFor='signupEmail' className="text-lg">Email</label>
                                <Field name="signupEmail" type="email" className="h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600" />
                                <div className="text-red-700 text-sm my-1">
                                    <ErrorMessage name="signupEmail" />
                                </div>
                            </div>

                            <div className="w-full flex flex-col px-12 gap-1">
                                <label htmlFor='signupPassword' className="text-lg">Password</label>
                                <Field name="signupPassword" type="password" className="h-[38px] bg-zinc-600 outline-none px-4 rounded focus:ring-1 focus:ring-blue-600" />
                                <div className="text-red-700 text-sm my-1">
                                    <ErrorMessage name="signupPassword" />
                                </div>
                            </div>

                            <button className='bg-zinc-800 w-32 h-12 text-lg rounded hover:bg-zinc-900 border border-zinc-900 hover:border-green-600' type="submit">
                                {isSubmitting ? (
                                    <SyncLoader className='mx-auto' size={10} color='#fff' />
                                ) : (
                                    'Signup'
                                )}
                            </button>

                            <p className='text-sm'>Already have an account?
                                <span className='text-blue-500 cursor-pointer' onClick={() => switchForm('login', resetForm)}>  Login</span>
                            </p>
                        </Form>
                        <Toaster />
                    </div>
                )}
            </Formik>
        )
    );
}

export default AuthPage;
