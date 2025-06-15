import React, { useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bell, MessageCircle, User, LogOut, ChevronDown } from 'lucide-react';

function Navbar() {
    const { logout, user } = useContext(AuthContext); // Assumant que user contient les infos utilisateur
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const profileDropdownRef = useRef(null);

    const handleLogout = useCallback(() => {
        logout();
        navigate("/login");
    }, [logout, navigate]);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen(prev => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    const toggleProfileDropdown = useCallback(() => {
        setIsProfileDropdownOpen(prev => !prev);
    }, []);

    // Fermer le dropdown quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav> 
            <ul className='menu m-0'>
                <li className='logo text-white'>
                    <Link to="/" onClick={closeMenu}>Taskwave</Link>
                </li>
                
                <li className={`item text-white ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/notifications" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bell size={18} />
                        <span>Mes notifications</span>
                    </Link>
                </li>
                
                <li className={`item text-white ${isMenuOpen ? 'active' : ''}`}>
                    <Link to="/messages" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MessageCircle size={18} />
                        <span>Messages</span>
                    </Link>
                </li>

                {/* Menu profil avec dropdown */}
                <li className={`item text-white profile-dropdown ${isMenuOpen ? 'active' : ''}`} ref={profileDropdownRef}>
                    <button 
                        type="button"
                        onClick={toggleProfileDropdown}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'inherit',
                            cursor: 'pointer',
                            fontSize: 'inherit',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        {/* Avatar utilisateur */}
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#4f46e5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold'
                        }}>
                            {user?.avatar ? (
                                <img 
                                    src={user.avatar} 
                                    alt="Avatar" 
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                            )}
                        </div>
                        <span className="hidden md:inline"></span>
                        <ChevronDown 
                            size={16} 
                            style={{
                                transform: isProfileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s'
                            }}
                        />
                    </button>

                    {/* Dropdown menu */}
                    {isProfileDropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            right: '0',
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            minWidth: '180px',
                            zIndex: 1000,
                            marginTop: '8px',
                            overflow: 'hidden'
                        }}>
                            <Link 
                                to="/profile" 
                                onClick={() => {
                                    setIsProfileDropdownOpen(false);
                                    closeMenu();
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    color: '#374151',
                                    textDecoration: 'none',
                                    borderBottom: '1px solid #e5e7eb',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <User size={18} />
                                <span>Mon profil</span>
                            </Link>
                            
                            <button 
                                type="button"
                                onClick={() => {
                                    setIsProfileDropdownOpen(false);
                                    handleLogout();
                                }}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    background: 'none',
                                    border: 'none',
                                    color: '#dc2626',
                                    cursor: 'pointer',
                                    fontSize: 'inherit',
                                    textAlign: 'left',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                            >
                                <LogOut size={18} />
                                <span>Se déconnecter</span>
                            </button>
                        </div>
                    )}
                </li>

                <li className='toggle text-white' onClick={toggleMenu}>
                    <span className='bars'></span>
                </li>
            </ul>

            <style jsx>{`
                .profile-dropdown {
                    position: relative;
                }
                
                @media (max-width: 768px) {
                    .profile-dropdown .dropdown-menu {
                        position: static;
                        box-shadow: none;
                        background-color: rgba(255,255,255,0.1);
                        margin-top: 0;
                    }
                }
            `}</style>
        </nav>
    );
}

export default Navbar;