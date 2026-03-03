import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from './firebase';

// Helper to save user data to Firestore
const saveUserToFirestore = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        const { email, displayName, photoURL, uid } = user;
        try {
            await setDoc(userRef, {
                userId: uid,
                email,
                displayName: displayName || email.split('@')[0],
                profilePhoto: photoURL || '',
                credits: 50,
                subscriptionPlan: 'free',
                createdAt: serverTimestamp(),
                ...additionalData
            });
        } catch (error) {
            console.error('Error creating user document', error);
            throw error;
        }
    }
};

export const registerUser = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (name) {
        await updateProfile(user, { displayName: name });
    }

    await saveUserToFirestore(user, { displayName: name });
    return user;
};

export const loginUser = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

export const logoutUser = async () => {
    await signOut(auth);
};

export const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
};

export const signInWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    await saveUserToFirestore(userCredential.user);
    return userCredential.user;
};

export const deleteUserAccount = async () => {
    const user = auth.currentUser;
    if (user) {
        import('firebase/auth').then(({ deleteUser }) => deleteUser(user));
    }
};

export const getUserDetails = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
        return snapshot.data();
    }
    return null;
};

export const deductUserCredit = async (uid, amount = 1) => {
    try {
        const userRef = doc(db, 'users', uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
            const userData = snapshot.data();

            // Premium users have unlimited credits, skip deduction
            if (userData.subscriptionPlan === 'premium') {
                return true;
            }

            const currentCredits = userData.credits || 0;
            if (currentCredits >= amount) {
                await setDoc(userRef, { credits: currentCredits - amount }, { merge: true });
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Error deducting user credit:', error);
        throw error;
    }
};

// --- Admin Methods ---

export const getAllUsers = async () => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef);
        const snapshot = await getDocs(q);

        const users = [];
        snapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return users;
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw error;
    }
};

export const updateUserCredits = async (uid, newCreditAmount) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { credits: newCreditAmount });
        return true;
    } catch (error) {
        console.error("Error updating user credits:", error);
        throw error;
    }
};

export const toggleUserBlock = async (uid, currentBlockStatus) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, { isBlocked: !currentBlockStatus });
        return !currentBlockStatus;
    } catch (error) {
        console.error("Error toggling user block status:", error);
        throw error;
    }
};

export const updateUserSubscription = async (uid, plan, credits) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            subscriptionPlan: plan,
            credits: credits,
        });
        return true;
    } catch (error) {
        console.error("Error updating user subscription:", error);
        throw error;
    }
};
