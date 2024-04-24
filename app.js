const express = require('express');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(`public`));

app.set(`view engine`, `ejs`);
app.set('views', './views');
app.set('port', 3000);

const booksrouter = require(`./routers/booksrouter`);
const indexrouter = require(`./routers/indexrouter`);

app.use('/', indexrouter);
app.use('/books', booksrouter);
app.use('/public', express.static(__dirname + '/public'));



app.listen(3000, () => {
    console.log("listening on 3000");
})