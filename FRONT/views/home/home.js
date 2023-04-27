import * as Api from '../api.js';

const hotItems = document.querySelectorAll("#hotItems > li");
const discountItems = document.querySelectorAll("#discountItems > li");

await getData('/api/products/popular', hotItems);
await getData('/api/products/discount', discountItems);
async function getData(apiUrl, element){
    try {
        const { data } = await Api.get(apiUrl);
        console.log(data)
        for(let i = 0; i < 4; i++){
            if(i >= data.length){
                break;
            }
            const { imagePaths, productName, price } = data[i];
            element[i].querySelector('img').src = imagePaths[0];
            element[i].querySelector('img').alt = `${productName} 사진`;
            element[i].querySelector('div > h5').innerText = productName;
            element[i].querySelector('div > p').innerText = price;
        }
    } catch(err) {
        console.log(err.message);
    }
}