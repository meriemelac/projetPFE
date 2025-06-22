import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/api";
import { AuthContext } from "../context/AuthContext";
import loginImg from "../assets/1.png";

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

            const token = response.data.token;
            const user = response.data.user;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role_id: user.role_id
            }));

            login(user);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Échec de la connexion");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row border rounded-5 p-3 bg-white shadow box-area">

                {/* Boîte de gauche */}
                <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{ background: "#0077B6" }}>
                    <div className="featured-image mb-3">
                        <img src={loginImg} alt="image de connexion" style={{ width: "250px" }} />
                    </div>
                    <p className="text-white fs-2" style={{ fontFamily: "courier", fontWeight: 600 }}>Soyez vérifié !</p>
                    <small className="text-white text-wrap text-center" style={{ fontFamily: "courier", width: "17rem" }}>
                        Organisez vos équipes et vos projets avec Taskwave
                    </small>
                </div>

                {/* Boîte de droite */}
                <div className="col-md-6 right-box">
                    <div className="row align-items-center">
                        <div className="header-text mb-4">
                            <h1>Connexion</h1>
                        </div>
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <form onSubmit={handleLogin}>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Adresse e-mail"
                                />
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-control form-control-lg bg-light fs-6"
                                    placeholder="Mot de passe"
                                />
                            </div>
                            <div className="input-group mb-5 d-flex justify-content-between">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="formCheck" />
                                    <label htmlFor="formCheck" className="form-check-label text-secondary">
                                        <small>Se souvenir de moi</small>
                                    </label>
                                </div>
                                <div className="forgot">
                                    <small><a className="text-secondary" href="#">Mot de passe oublié ?</a></small>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <button type="submit"
                                className="text-white  px-4 py-2 rounded w-full"
                            style={{ backgroundColor: "#0077B6" }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0098e9")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#0077B6")}>
                                    Se connecter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
