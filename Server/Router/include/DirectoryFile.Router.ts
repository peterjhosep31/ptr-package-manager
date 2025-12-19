import { Router } from "express";

const ROUTER = Router();

ROUTER.get("/download", (_req, res) => {
    res.send("Download Directory");
});

export default ROUTER;
