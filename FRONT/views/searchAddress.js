const addressInput = document.querySelector("#address");
const detailAddressInput = document.querySelector("#detailAddress");
const searchAddressBtn = document.querySelector("#searchAddressBtn");

searchAddressBtn.addEventListener("click", searchAddress);

async function searchAddress(e) {
  e.preventDefault();
  new daum.Postcode({
    height: "600px",
    oncomplete: function (data) {
      let addr = "";
      let extraAddr = "";

      if (data.userSelectedType === "R") {
        addr = data.roadAddress;
      } else {
        addr = data.jibunAddress;
      }

      if (data.userSelectedType === "R") {
        if (data.bname !== "" && /[동|로|가]$/g.test(data.bname)) {
          extraAddr += data.bname;
        }
        if (data.buildingName !== "" && data.apartment === "Y") {
          extraAddr +=
            extraAddr !== "" ? ", " + data.buildingName : data.buildingName;
        }
        if (extraAddr !== "") {
          extraAddr = " (" + extraAddr + ")";
        }
      } else {
      }

      addressInput.value = `${addr} ${extraAddr}`;
      detailAddressInput.focus();
    },
  }).open();
}
