export function handleLogout() {
    localStorage.removeItem('userToken');
    window.dispatchEvent(new Event('logout'));
}