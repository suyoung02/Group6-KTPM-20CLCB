import express from "express";
import coursesService from "../services/courses.service.js";

const router = express.Router();

router.get("/", async function (req, res) {
  const list = await coursesService.findAll();
  res.render("vwCourses/byCat", {
    courses: list,
    empty: list.length === 0,
  });
});

router.get("/byCat/:id", async function (req, res) {
  const catId = req.params.id || 0;

  for (let c of res.locals.lcCategories) {
    if (c.CatID === +catId) c.isActive = true;
  }

  const curPage = req.query.page || 1;
  const limit = 6;
  const offset = (curPage - 1) * limit;

  const total = await coursesService.countByCatId(catId);
  const nPages = Math.ceil(total / limit);

  const pageNumbers = [];
  for (let i = 1; i <= nPages; i++) {
    pageNumbers.push({
      value: i,
      isCurrent: i === +curPage,
    });
  }

  const list = await coursesService.findPageByCatId(catId, limit, offset);
  res.render("vwCourses/byCat", {
    courses: list,
    empty: list.length === 0,
    pageNumbers: pageNumbers,
  });
});
router.get('/detail/:id', async function (req, res) {
  const proId = req.params.id || 0;
  const product = await coursesService.findById(proId);
  const listMost=await coursesService.findCourMostBuy(proId);
  
  if (product === null) {
    return res.redirect('/');
  }

  res.render('vwCourses/detail', {
    product: product,
    listMost
  });
});
export default router;