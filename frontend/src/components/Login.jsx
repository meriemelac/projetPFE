import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/api";
import { AuthContext } from "../context/AuthContext"; // Import du contexte
import loginImg from "../assets/1.png"

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axiosInstance.post("/login", { email, password });

            // Sauvegarde du token et mise à jour de l'état global
            login(response.data.token, response.data.user.first_name, response.data.user.last_name, response.data.user.role_id);

            // Redirection vers la page d'accueil après connexion
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row border rounded-5 p-3 bg-white shadow box-area">

                {/* left box   */}
                <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{ background: "#139" }}>
                    <div className="featured-image mb-3">
                        <img src={loginImg} alt="login-image" style={{ width: "250px" }} />
                    </div>
                    <p className="text-white fs-2" style={{ fontFamily: "courier", fontWeight: 600 }}>Be verified</p>
                    <small className="text-white text-wrap text-center" style={{ fontFamily: "courier", width: "17rem" }}>Organize your teams and projects with taskwave</small>
                </div>


                {/* right box */}
                <div className="col-md-6 right-box">
                    <div className="row align-items-center">
                        <div className="header-text mb-4">
                            <h1>Connexion</h1>
                            <p>We are happy to have you back</p>
                        </div>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <form onSubmit={handleLogin}>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Email address" />
                            </div>
                            <div className="input-group mb-1">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Password" />
                            </div>
                            <div className="input-group mb-5 d-flex justify-content-between">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="formCheck" />
                                    <label for="fromCheck" className="form-check-label text-secondary"><small>Remember Me</small></label>
                                </div>
                                <div className="forgot">
                                    <small><a href="#">Forgot Password?</a></small>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <button type="submit" className="btn btn-lg btn-primary w-100 fs-6">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        // <div>
        //     <h2>Connexion</h2>
        //     {error && <p style={{ color: "red" }}>{error}</p>}
        //     <form onSubmit={handleLogin}>
        //         <div>
        //             <label>Email :</label>
        //             <input
        //                 type="email"
        //                 value={email}
        //                 onChange={(e) => setEmail(e.target.value)}
        //                 required
        //             />
        //         </div>
        //         <div>
        //             <label>Mot de passe :</label>
        //             <input
        //                 type="password"
        //                 value={password}
        //                 onChange={(e) => setPassword(e.target.value)}
        //                 required
        //             />
        //         </div>
        //         <button type="submit">Se connecter</button>
        //     </form>
        // </div>
    );
};

export default Login;
