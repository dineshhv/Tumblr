
const express = require('express');
const path = require('path');
const glob = require('glob');

const router = express.Router();

router.get('/health-check', (req, res) =>{
  console.log(req.subscribe)
  res.send('OK')
});


const routes = glob.sync(path.join(__dirname, "/*.routes.js"));

routes.forEach(route => {
  let routeName = route.substring(route.lastIndexOf("/"), route.lastIndexOf(".routes.js"));
  console.log("Loading route :: " + routeName);
  router.use(routeName, require(route));
})

module.exports = router;
