const loginLink = document.querySelector('#login') as HTMLElement;
const logoutLink = document.querySelector('#logout') as HTMLElement;
const allToursLink = document.querySelector('#allTours') as HTMLElement;
const addTourLink = document.querySelector('#addTour') as HTMLElement;


function setUserLoginState(isLoggedIn: boolean) {
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
        allToursLink.style.display = 'block';
        addTourLink.style.display = 'block';

    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
        allToursLink.style.display = 'none';
        addTourLink.style.display = 'none';
    }
}

export function handleLogout() {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUserLoginState(false);
}

export function checkLoginStatus() {
    const username = localStorage.getItem('username');
    if (username) {
        setUserLoginState(true);
    } else {
        setUserLoginState(false);
    }
}

const logoutElement = document.querySelector('#logout');
if (logoutElement) {
    logoutElement.addEventListener('click', handleLogout);
}

