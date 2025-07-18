// TODO: write this file!
// import "./fetch-polyfill.js";
// import fetch from "node-fetch";

const response = await fetch("https://joel-portfolio.web.app/");
const body = await response.text();

console.log(body);
