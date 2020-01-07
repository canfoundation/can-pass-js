import insertCSS from "insert-css";

const inject = () =>
  insertCSS(`
  .can-pass-login-button {
    border-radius: 5px;
    background-color: rgb(255, 255, 0);
    box-sizing: border-box;
    color: rgb(0, 13, 255);
    cursor: pointer;
    font-family: Helvetica, Arial, sans-serif;
    font-weight: bold;
    font-size: 14px;
    padding: 0 10px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    outline: none;
    border: 0;
  }

  .can-pass-login-button > img {
    height: 100%;
    width: 25px;
    margin-right: 10px;
  }
`);

export default inject;
