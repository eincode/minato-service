import { Router } from "express";

import { auth } from "../middlewares/Auth";

const route = Router();

export default (app: Router) => {
  app.use("/users", route);

  route.get("/me", auth, (req, res) => {
    return res
      .json({
        user: req.user,
      })
      .status(200);
  });
};
