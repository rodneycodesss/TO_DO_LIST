import { useState} from "react";
import { useNavigate } from "react-router-dom";

const USERS_STORAGE_KEY = 'todo_app_users';

const Login = ({ setUser, setUserRole }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 
    setMessageType("");

    try {

      const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
      if (isNewUser) {
        // Sign Up
        const userExists = storedUsers.find(user => user.email === email);
        if (userExists) {
          setMessage("User with this email already exists. Please login or use a different email.");
          setMessageType("error");
          return;
        }
      
        const newUser = { email, password }; // Storing password directly 
        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        
        setMessage("Sign up successful! Please log in.");
        setMessageType("success");
        console.log("Sign Up successful for:", { email });
        setIsNewUser(false); // Switch to login form
        setEmail("");        
        setPassword("");    

      } else {
        // Login
        const user = storedUsers.find(user => user.email === email);
        if (!user) {
          setMessage("No user found with this email. Please sign up.");
          setMessageType("error");
          return;
        }

      let userCredential;
      console.log("Form Submitted", { email, password, isNewUser });
      navigate("/Inbox", { state: { user: userCredential } });
      


        if (user.password !== password) { // password comparison 
          setMessage("Incorrect password.");
          setMessageType("error");
          return;
        }
        
        if (setUser) setUser(user); // Pass the logged-in user 
        if (setUserRole) setUserRole("user"); 

        console.log("Login successful for:", { email });
        // hiding this Login
      }
    } catch (error) {
      console.error("Error during authentication", error);
      setMessage(`An error occurred: ${error.message || "Unknown error"}`);
      setMessageType("error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {isNewUser ? "Create an Account" : "Log In to Your Account"}
        </h2>

        {message && (
          <div
            className={`p-3 rounded-md text-sm ${
              messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage(""); 
                setMessageType("");
              }}

              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage("");
                setMessageType("");
              }}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isNewUser ? "Sign Up" : "Login"}
          </button>
        </form>

        {/* Toggle between Login and Sign Up */}
        <p className="text-sm text-center text-gray-600">
          {isNewUser ? "Already have an account?" : "New user?"}{" "}
          <button
            onClick={() => {
              setIsNewUser(!isNewUser);
              setMessage(""); 
              setMessageType("");
            }}
          >
            {isNewUser ? "Login here" : "Sign Up now"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;