import * as Api from "../api.js";

const userName = document.querySelector("#name");
const userEmail = document.querySelector("#email");
const userPhoneNumber = document.querySelector("#phoneNumber");
const userAddress = document.querySelector("#userAddress");
const infoBtn = document.querySelector("#infoBtn");
const receiverName = document.querySelector("#receiverName");
const receiverEmail = document.querySelector("#receiverEmail");
const receiverPhoneNumber = document.querySelector("#receiverPhoneNumber");
const address = document.querySelector("#address");
const receiverRequirement = document.querySelector("#receiverRequirement");


// user-info에서 get 받아오기
async function getData() {
    try {
        return await Api.get('/api/users/user-info');
    } catch (err) {
        alert(err.message);
    }
}
// 유저정보 넣어주기
async function loadUser(){
    const {name, email, phoneNumber, address} = await getData();
    userName.innerText = name;
    userEmail.innerText = email;
    userPhoneNumber.innerText = phoneNumber;
    userAddress.innerText = address;
}
await loadUser();

function handleUserInfo(e){
    e.preventDefault();
    receiverName.value = userName.innerText;
    receiverEmail.value = userEmail.innerText;
    receiverPhoneNumber.value = userPhoneNumber.innerText;
    address.value = userAddress.innerText;
}

infoBtn.addEventListener("click", handleUserInfo);