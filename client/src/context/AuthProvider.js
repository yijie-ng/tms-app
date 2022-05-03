import { createContext, useEffect, useReducer } from "react";

// reducer to modify/manage the state of the context
// takes in current state value from reducer and new state provided by user and combines them
// To logout, on click of logout btn, setAuth to null and clear the localStorage and reset to initial state
let reducer = (auth, newAuth) => {
    if (newAuth === null) {
        localStorage.clear();
        return initialState;
    }
    return { ...auth, ...newAuth };
};

const initialState = {};

// pull in the value from localStorage if it exists
const localState = JSON.parse(localStorage.getItem("user"));

// don't pass in value into createContext as set it later in AuthProvider
const AuthContext = createContext();

export const AuthProvider = (props) => {
    // set initial state of reducer to localState if it exists, otherwise, the initialState defined earlier
    const [auth, setAuth] = useReducer(reducer, localState || initialState);

    // save the localState as in-memory state is changed
    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(auth));
    }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {props.children}
        </AuthContext.Provider>
    );

// const AuthContext = createContext({});

// destructure the children, which are the components nested inside authProvider
// export const AuthProvider = ({ children }) => {
//     const [auth, setAuth] = useState({});

//     useEffect(() => {
//         const user = localStorage.getItem("USER");
//         if (user !== null) {
//             setAuth(JSON.parse(user));
//         };
//     }, []);
    
//     useEffect(() => {
//         localStorage.setItem("USER", JSON.stringify(auth));
//     }, [auth]);

//     console.log(auth);

    // return (
    //     <AuthContext.Provider value={{ auth, setAuth }}>
    //         {children}
    //     </AuthContext.Provider>
    // )
}

export default AuthContext;