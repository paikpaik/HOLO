import * as Api from '../api.js';

async function handleLogout() {
    try {
        const result = await Api.post('/api/users/logout');
        sessionStorage.removeItem("token");
        alert(result.message);
        window.location.href = '/';
    } catch (err) {
        alert('로그인 상태가 아닙니다');
        window.location.href = '/';
    }
}

window.onload = handleLogout;