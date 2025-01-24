'use client';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { auth, createUserWithEmailAndPassword, handleResetPassword, signInWithEmailAndPassword } from '@/lib/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { getDatabase, ref, set } from 'firebase/database';
import Swal from 'sweetalert2';

interface Column {
    title: string;
    id: number;
}

interface Task {
    id: number;
    colId: number;
    text: string;
    desc: string;
    comments: { commentId: number, commentText: string }[]
}

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


    function correctEmail(email: string): string {
        return email.replace(/\./g, ',');
    }

    async function addDataToDb(colData: Column[], taskData: Task[], email: string) {
        const encodedEmail = correctEmail(email);
        const db = getDatabase();

        try {
            await set(ref(db, `columns/${encodedEmail}`), colData);
            console.log("Columns added successfully");
        } catch (error) {
            console.error("Error adding columns: ", error);
        }

        try {
            await set(ref(db, `tasks/${encodedEmail}`), taskData);
            console.log("Tasks added successfully", taskData);
        } catch (error) {
            console.error("Error adding tasks: ", error);
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState("");

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleResetPassword(email);
        setIsModalOpen(false);
        Swal.fire("Email sent with reset password link.");
    };

    return (
        <>
            <div className="flex items-center justify-center bg-zinc-800">
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-zinc-800 p-6 rounded shadow-lg w-[60%]">
                            <h2 className="text-xl font-semibold mb-4 text-zinc-300">Reset Password</h2>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full bg-black  p-2 outline-none text-zinc-300 rounded mb-4"
                                />
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-zinc-900 rounded hover:bg-zinc-700"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {
                showLoginForm ? (
                    <Formik
                        initialValues={{ loginEmail: '', loginPassword: '' }}
                        validationSchema={Yup.object({
                            loginEmail: Yup.string()
                                .email('Invalid email address')
                                .required('Required')
                                .matches(/@[^.]*\./, 'Invalid email address'),
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
                                        localStorage.setItem('isLoginSaved', 'true');
                                        if (user?.email) {
                                            localStorage.setItem('userEmail', user?.email);
                                        }
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
                            <div className='h-4/5 w-full text-white flex justify-center items-center bg-zinc-900'>
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

                                    {
                                        !isModalOpen && (
                                            <div className="w-full flex flex-col px-12 -translate-y-3">
                                                <p className='cursor-pointer text-sm text-blue-500 text-left w-full' onClick={() => { handleOpenModal() }}>Forgot Password?</p>
                                            </div>
                                        )
                                    }

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
                            signupEmail: Yup.string()
                                .email('Invalid email address')
                                .required('Required')
                                .matches(/@[^.]*\./, 'Invalid email address'),
                            signupPassword: Yup.string()
                                .max(20, 'Must be 20 characters or less')
                                .required('Required')
                                .min(6, 'Must be 6 characters or more'),
                            signupUsername: Yup.string()
                                .max(20, 'Must be 20 characters or less')
                                .required('Required'),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                createUserWithEmailAndPassword(auth, values.signupEmail, values.signupPassword)
                                    .then((userCredential) => {
                                        addDataToDb([
                                            { title: "To Do", id: 1 },
                                            { title: "In Progress", id: 2 },
                                            { title: "Done", id: 3 },
                                        ], [], values.signupEmail);
                                        const user = userCredential.user;
                                        console.log('account created', user);
                                        setSubmitting(false);
                                        localStorage.setItem('isLoginSaved', 'true');
                                        if (user?.email) {
                                            localStorage.setItem('userEmail', user?.email);
                                        }
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
                            <div className='h-4/5 w-full text-white flex justify-center items-center bg-zinc-900'>
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
            }
        </>
    );
}

export default AuthPage;
