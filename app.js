import express from 'express';
import { engine } from 'express-handlebars';

import coursesService from "./services/courses.service.js";
import accountRoute from "./routes/account.route.js";
import hbs_sections from 'express-handlebars-sections'
const app = express();
app.use(express.urlencoded({
    extended: true
}));

app.use('/public', express.static('public'));

app.use('/account', accountRoute)
app.engine('hbs', engine({
    // defaultLayout: 'main.hbs'
    extname: 'hbs',
    defaultLayout: 'bs4',
    helpers: {
        section: hbs_sections(),
        format_number(val) {
            return numeral(val).format('0,0');
        }
    }

}));
app.set('view engine', 'hbs');
app.set('views', './views');

app.get('/',async function (req, res){
    const list = await coursesService.findNewestCourses();
    res.render('home', {
        newest: list
    });
});

app.post('/',async function(req,res){
    const a = req.body.rate;
    const b = req.body.comment;
    console.log(a);
    console.log(b);
    res.redirect('/');
})

const PORT = 3000;
app.listen(PORT, function () {
    console.log(`E-commerce application listening at http://localhost:${PORT}`);
})