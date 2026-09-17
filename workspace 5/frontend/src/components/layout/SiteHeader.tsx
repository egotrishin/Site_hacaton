import { useState } from 'react';
import { Bell, LogIn, LogOut, Menu, NotebookPen, UserRound, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';

const navItems = [
  { label: 'Главная', to: '/' },
  { label: 'ЕГЭ', to: '/ege' },
  { label: 'Олимпиады', to: '/olympiads' },
  { label: 'Конкурсные списки', to: '/competition' },
  { label: 'Избранное', to: '/favorites' },
  { label: 'Дедлайны', to: '/deadlines' },
  { label: 'Чек-лист', to: '/checklist' },
  { label: 'Мероприятия', to: '/events' },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn, profile, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink className="brand" to="/" aria-label="Тетрадь абитуриента — на главную">
          <span className="brand__mark" aria-hidden="true"><NotebookPen size={20} strokeWidth={2.2} /></span>
          <span>Тетрадь <strong>абитуриента</strong></span>
        </NavLink>

        <nav className="desktop-nav" aria-label="Основная навигация">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}>{item.label}</NavLink>
          ))}
        </nav>

        <div className="header-account">
          {isSignedIn && profile ? (
            <>
              <NavLink className={({ isActive }) => `header-account__profile${isActive ? ' header-account__profile--active' : ''}`} to="/profile" aria-label="Открыть личный кабинет"><UserRound size={17} /><span>{profile.name}</span></NavLink>
              <NavLink className={({ isActive }) => `header-account__notify${isActive ? ' header-account__profile--active' : ''}`} to="/notifications" aria-label="Открыть уведомления"><Bell size={17} /><span>Уведомления</span></NavLink>
              <button className="header-account__signout" type="button" onClick={handleSignOut} aria-label="Выйти из демо-профиля"><LogOut size={17} /></button>
            </>
          ) : (
            <NavLink className="header-account__login" to="/login"><LogIn size={17} /><span>Войти</span></NavLink>
          )}
        </div>

        <button className="menu-button" type="button" aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setIsOpen((value) => !value)}>{isOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>

      <div id="mobile-navigation" className={`mobile-nav${isOpen ? ' mobile-nav--open' : ''}`}>
        <nav aria-label="Мобильная навигация">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setIsOpen(false)} className={({ isActive }) => `mobile-nav__link${isActive ? ' mobile-nav__link--active' : ''}`}>{item.label}</NavLink>
          ))}
          <NavLink to={isSignedIn ? '/profile' : '/login'} onClick={() => setIsOpen(false)} className={({ isActive }) => `mobile-nav__link${isActive ? ' mobile-nav__link--active' : ''}`}>{isSignedIn ? 'Личный кабинет' : 'Войти'}</NavLink>
          {isSignedIn && <NavLink to="/notifications" onClick={() => setIsOpen(false)} className={({ isActive }) => `mobile-nav__link${isActive ? ' mobile-nav__link--active' : ''}`}>Уведомления</NavLink>}
          {isSignedIn && <button className="mobile-nav__link mobile-nav__button" type="button" onClick={handleSignOut}>Выйти из демо-профиля</button>}
        </nav>
      </div>
    </header>
  );
}
