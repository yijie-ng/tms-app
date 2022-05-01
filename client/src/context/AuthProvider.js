import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

// destructure the children, which are the components nested inside authProvider
export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    useEffect(() => {
        const user = localStorage.getItem("USER");
        if (user !== null) setAuth(JSON.parse(user));
    }, []);
    
    useEffect(() => {
        localStorage.setItem("USER", JSON.stringify(auth));
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;