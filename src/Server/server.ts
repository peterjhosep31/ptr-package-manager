import Express from "express";
import ROUTER from "./Router/Router.ts";

const APP = Express();

APP.use(ROUTER);

APP.listen(3000, () => {
    console.log("Server is running on port 3000");
});
