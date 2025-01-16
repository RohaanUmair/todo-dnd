import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";



const firebaseConfig = {
    apiKey: "AIzaSyCATi7r4g850WmUJH8w-i-VtwT7Ebd0DHU",
    authDomain: "kanban-app-cc992.firebaseapp.com",
    projectId: "kanban-app-cc992",
    storageBucket: "kanban-app-cc992.firebasestorage.app",
    messagingSenderId: "549496910940",
    appId: "1:549496910940:web:411e48e06834c42a72a299"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);




function createAccount(email: string, password: string) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('account created');
        })
        .catch((error) => {
            const errorCode = error.code;
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
        });
}


function loginUser(email: string, password: string) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log(errorMessage);

            if (errorMessage == 'Firebase: Error (auth/invalid-credential).') {
                const notify = () => toast.error('Invalid credentials!', {
                    duration: 1000,
                    position: 'top-center',
                });
                notify();
            }
        });
}


async function addDataToDb(colData: any, taskData: any, email: string) {
    try {
        await setDoc(doc(db, "columns", email), {
            data: colData
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }

    try {
        await setDoc(doc(db, "tasks", email), {
            data: taskData
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}



function handleSignout() {
    signOut(auth)
        .then(() => {
            console.log('logged out')
        })
        .catch((error) => {
            console.log(error);
        });
}



export {
    createAccount,
    loginUser,
    onAuthStateChanged,
    auth,
    addDataToDb,
    db,
    doc,
    getDoc,
    handleSignout
}