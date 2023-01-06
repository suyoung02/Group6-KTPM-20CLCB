import db from "../utils/db.js";

export default {
  findAll() {
    return db("courses");
  },
  async countAll() {
    const list = await db("courses").count({ amount: "CourID" });
    return list[0].amount;
  },
  async countByCatId(catId) {
    const list = await db("courses")
      .where("CatID", catId)
      .count({ amount: "CourID" });

    return list[0].amount;
  },
  async countByCourId(Courid) {
    const ret = await db.raw(
        "select count(*) as CourCount from courses as course, wishcourses as wishlist where course.CourID=wishlist.CourID");
    return ret[0];
  },

  async findByTeacherID(id){
    return db("courses").where("TeacherID",id);
  },

  async findById(id) {
    const list = await db("courses").where("CourID", id);
    if (list.length === 0) return null;

    return list[0];
  },
  async findCourMostViews(id)
  {
    const Id=await db('courses').select('CatID').where('CourID',id);
    
    const list=await db('courses').where('CatID',+Id[0].CatID).whereNot('CourID',id).orderBy('Views').limit(5);
    if (list.length === 0) return null;

    return list;
  },

  findPageByCatId(catId, limit, offset) {
    return db("courses").where("CatID", catId).limit(limit).offset(offset);
  },
  findPageAll(limit, offset) {
    return db("courses").limit(limit).offset(offset);
  },
  findByCatId(catID) {
    return db("courses").where("CatID", catID);
  },

  findwishcourses(coursesID){
    return db("wishcourses").where("CourID", coursesID);
  },
  findstudentcourses(coursesID){
    return db("enroll").where("CourID", coursesID);
  },
  async findNewestCourses() {
    return db("courses").limit(10).orderBy("dob", "desc");
  },

  async findPopularCourses() {
    const sql = `SELECT rated.CourID, courses.CourName, CONVERT(AVG(rated.Rating), float) as score
                 FROM coursesrating rated, courses
                 WHERE rated.CourID = courses.CourID
                 GROUP BY rated.CourID
                 ORDER BY score DESC
                 LIMIT 3`;
    const ret = await db.raw(sql);
    return ret[0];
  },
  async searchByName(name) {
    const ret = await db.raw(
      "select  linhvuc.CatName , khoahoc.*  from categories as linhvuc, courses as khoahoc where linhvuc.CatID=khoahoc.CatID and match(linhvuc.CatName,khoahoc.CourName) against(? IN BOOLEAN MODE )",
      name
    );
    console.log(ret[0]);
    return ret[0];
  },

  async countsearch(name) {
    const ret = await db.raw(
      "select linhvuc.CatName,count(khoahoc.CourID) as CourCount from categories as linhvuc, courses as khoahoc where linhvuc.CatID=khoahoc.CatID and match(linhvuc.CatName,khoahoc.CourName) against(? IN BOOLEAN MODE ) group by linhvuc.CatName",
      name
    );
    console.log(ret[0]);
    return ret[0];
  },

  async wishcourses(CourID){
    const ret = await db.raw(
        "select *from courses as course, wishcourses as wishlist where course.CourID=wishlist.CourID");
    return ret[0];
  },

  async increaseView(id) {
    const list = await db("courses").where("CourID", id);
    return db("courses")
      .where("CourID", id)
      .update({ Views: list[0].Views + 1 });
  },

  async getNextID(){
    const sql = `SELECT AUTO_INCREMENT FROM information_schema.tables WHERE table_name = 'courses' and table_schema = 'sus';`
    const ret = await db.raw(sql);
    return ret[0];
  },
  addNew(courses) {
    return db("courses").insert(courses);
  },

  del(id) {
    return db("courses").where("CourID", id).del();
  },

  patch(courses) {
    const id = courses.CourID;
    delete courses.CourID;

    return db("courses").where("CourID", id).update(courses);
  },
  addwishcourses(wishlist){
    return db("wishcourses").insert(wishlist);
  },
  addstudentcourses(courses){
    return db("enroll").insert(courses);
  }
}


