import * as Api from "../api.js";

const hotItems = document.querySelectorAll("#hotItems > li");
const discountItems = document.querySelectorAll("#discountItems > li");

// await getData("/api/products/popular", hotItems);
// await getData("/api/products/discount", discountItems);

async function getData(apiUrl, element) {
  try {
    const { data } = await Api.get(apiUrl);
    console.log(data);
    data.forEach((el) => {});
    for (let i; i < 4; i++) {
      if (i >= data.length) {
        break;
      }
      // const { imagePaths, productName, price } = data[i];
      // element.querySelector("img").src = imagePaths;
      // element.querySelector("div > h5").innerText = productName;
      // element.querySelector("div > p").innerText = price;
    }
  } catch (err) {
    alert(err.message);
  }
}

async function getCategoryData() {
  const url = new URL(window.location.href);
  const categoryId = url.searchParams.get("categoryId");

  // element.querySelector("ul") =

  await getData(`/api/products/category/:${categoryId}`);
}

await getCategoryData();
