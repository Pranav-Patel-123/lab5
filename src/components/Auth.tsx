"use client";
import { useState, useEffect } from "react";
import { auth, googleProvider, db } from "../config/firebaseConfig";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

// User Data Type
interface UserData {
  id?: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  address: string;
}

export default function Auth() {
  const [user, setUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState<UserData>({
    name: "",
    age: 0,
    email: "",
    phone: "",
    address: "",
  });
  const [users, setUsers] = useState<UserData[]>([]);

  // Fetch Users on Login
  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  // Google Login
  const googleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      setUser(userCredential.user);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "age" ? Number(value) : value }));
  };

  // Add User to Firestore
  const addUser = async () => {
    const { name, age, email, phone, address } = formData;
    if (!name || !age || !email || !phone || !address) {
      alert("Please fill all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "users"), formData);
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Fetch Users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as UserData[];
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Update User in Firestore
  const updateUser = async (id: string) => {
    const updatedName = prompt("Enter updated name:");
    const updatedAge = prompt("Enter updated age:");
    const updatedEmail = prompt("Enter updated email:");
    const updatedPhone = prompt("Enter updated phone:");
    const updatedAddress = prompt("Enter updated address:");

    if (!updatedName || !updatedAge || !updatedEmail || !updatedPhone || !updatedAddress) return;

    try {
      await updateDoc(doc(db, "users", id), {
        name: updatedName,
        age: Number(updatedAge),
        email: updatedEmail,
        phone: updatedPhone,
        address: updatedAddress,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Delete User from Firestore
  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, "users", id));
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Reset Form Fields
  const resetForm = () => {
    setFormData({ name: "", age: 0, email: "", phone: "", address: "" });
  };

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-5xl p-12 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
        {!user ? (
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-extrabold text-white">Login with Google</h1>
            <button
              onClick={googleLogin}
              className="w-full p-4 bg-red-600 hover:bg-red-700 rounded-lg text-lg transition duration-300"
            >
              Login with Google
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            <h2 className="text-4xl font-bold text-center text-white">
              Welcome, {user.displayName || user.email}
            </h2>

            <button
              onClick={logout}
              className="w-full p-4 bg-gray-600 hover:bg-gray-700 rounded-lg text-lg transition duration-300"
            >
              Logout
            </button>

            <h3 className="text-2xl font-semibold text-white">Add User Data</h3>
            <div className="grid grid-cols-2 gap-6">
              {Object.keys(formData).map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field as keyof UserData]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="p-4 rounded-lg bg-gray-700 text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ))}
              <button
                onClick={addUser}
                className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg transition duration-300"
              >
                Add
              </button>
            </div>

            <h3 className="text-2xl font-semibold text-white">User List</h3>
            <div className="space-y-6">
              {users.map((user) => (
                <div key={user.id} className="flex flex-col gap-4 p-6 bg-gray-700 rounded-lg">
                  <span className="text-white text-lg">
                    {user.name} (Age: {user.age}) | Email: {user.email} | Phone: {user.phone} | Address: {user.address}
                  </span>
                  <div className="flex gap-4">
                    <button onClick={() => updateUser(user.id!)} className="p-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg">
                      Edit
                    </button>
                    <button onClick={() => deleteUser(user.id!)} className="p-3 bg-red-600 hover:bg-red-700 rounded-lg">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
