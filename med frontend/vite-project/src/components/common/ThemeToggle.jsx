import { useEffect, useState } from 'react';
export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <button className="btn btn-outline-secondary btn-sm theme-toggle" onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}>
      <i className={theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon'} />
    </button>
  );
}
