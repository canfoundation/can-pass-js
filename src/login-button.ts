import storage from "./storage";
import { LOGIN_BUTTON_CLASS_NAME } from "./constants";
import injectStyle from "./style";

const MAX_WIDTH = 500;
const MIN_WIDTH = 220;
const DATA_WIDTH = "data-width";
const DATA_STATE = "data-state";
const DATA_REDIRECT_URI = "data-redirect-uri";
const DATA_DOMAIN = "data-domain";
const DATA_TEXT = "data-text";
const LOGO_URL =
  "https://d1i5zj4k49u5j1.cloudfront.net/2892b68a3d6c71e94499bb027345fe7c.svg";

const getAttribute = (currentEl, attributeName, defaultValue = "") =>
  currentEl.getAttribute(attributeName) || defaultValue;

export default function initialize(id) {
  if (typeof window === "undefined") return;
  injectStyle();
  const loginButtons =
    document.getElementsByClassName(LOGIN_BUTTON_CLASS_NAME) || [];
  const clientId = id || storage.read("clientId") || "";

  for (let i = 0; i < loginButtons.length; i += 1) {
    const currentButton = loginButtons[i];
    if (currentButton) {
      // get Attributes
      const state = getAttribute(currentButton, DATA_STATE, "true");
      const domain = getAttribute(
        currentButton,
        DATA_DOMAIN,
        "https://test.cryptobadge.app"
      );
      const text = getAttribute(
        currentButton,
        DATA_TEXT,
        "Sign in with Cryptobadge"
      );
      const dataWidth = +getAttribute(
        currentButton,
        DATA_WIDTH,
        `${MIN_WIDTH}px`
      );
      const dataRedirectedURI = encodeURIComponent(
        getAttribute(currentButton, DATA_REDIRECT_URI, "")
      );

      // initial button width
      currentButton.style.width =
        dataWidth < MAX_WIDTH && dataWidth > MIN_WIDTH
          ? `${dataWidth}px`
          : `${MIN_WIDTH}px`;

      // generate nested elements
      const img = document.createElement("img");
      img.src = LOGO_URL;
      currentButton.appendChild(img);

      currentButton.innerHTML += "<span>" + text + "</span>";

      // add onClick event listener
      currentButton.addEventListener("click", () => {
        window.location.href = `${domain}/oauth2/authorize?response_type=code&client_id=${clientId}&scope=email&redirect_uri=${dataRedirectedURI}&state=${state}`;
      });
    }
  }
}
