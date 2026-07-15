"use strict";

import buildApp from "../configs/app.js";

let app;

export default async function handler(req, res) {
  if (!app) {
    app = await buildApp();
  }
  return app(req, res);
}
