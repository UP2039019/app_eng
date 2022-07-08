// https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/
// https://kb.objectrocket.com/postgresql/nodejs-express-postgresql-tutorial-part-1-960

const express = require("express");
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || 'postgresql://me:password@localhost:5432/postgres'

const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

// create a new Express app server object
const app = express();
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// declare a constant for the PostgreSQL table
const tableName = 'bricks';
const brickTableName = 'bricks';

// use alternate localhost and the port Heroku assigns to $PORT
const host = '0.0.0.0';
const port = process.env.PORT || 3000;
// const host = 'localhost';
// const port = 8080;


// get the path for the HTML file
const htmlPath = path.join(__dirname + "/index.html");
const aboutHtmlPath = path.join(__dirname + "/about.html");

// create a new client instance with the pg Pool() method
const client = new Pool({
  connectionString,

  port: "5432",

  ssl: {
    rejectUnauthorized: false
  }
});


// function that will return Postgres records as cards
function createHtmlTableClickable(tableRows, tableCol) {
// open a <script> tag for the string
  let htmlData = "<script>var tableData = `<thead>\n<tr>";
  console.log(`\ncreateHtmlTable:`);

  // use map() to iterate over the table column names
  tableCol.map(col => {
    col = col[0].toUpperCase() + col.substring(1, col.length);
    htmlData += `\n<th>${col}</th>`;
    console.log(`col: ${col}`);
  });

  // open the head and body tags for the table
  htmlData += `\n</thead>\n<tbody>\n`;
  console.log(`tableRows: ${typeof tableRows}`);

  // iterate over the table row data with map()
  tableRows.map(row => {
    // open a new table row tag for each Postgres row
    htmlData += `\n<tr>`;
    console.log(row)
    // iterate over the row's data and enclose in <td> tag
    for (val in row) {
      console.log(`${val},row[val]: ${row[val]}`);
      htmlData += "<td><a href='/productType/bricks/id/"+row["bid"]+"'>"+row[val]+"</a></td>";
      // htmlData += `\n<td><a href="/productType/bricks/id/>${row[bid]}"${row[val]}</a></td>`;
    }

    // close the table row <tr> tag
    htmlData += `\n</tr>`;
  });

  // close the table body and script tags
  htmlData += "\n</tbody>`;</script>";

  // return the string
  return htmlData;
}


// function that will return Postgres records as an HTML table
function createHtmlTable(tableRows, tableCol) {
  // open a <script> tag for the string
  let htmlData = "<script>var tableData = `<thead>\n<tr>";
  console.log(`\ncreateHtmlTable:`);

  // use map() to iterate over the table column names
  tableCol.map(col => {
    col = col[0].toUpperCase() + col.substring(1, col.length);
    htmlData += `\n<th>${col}</th>`;
    console.log(`col: ${col}`);
  });

  // open the head and body tags for the table
  htmlData += `\n</thead>\n<tbody>\n`;
  console.log(`tableRows: ${typeof tableRows}`);

  // iterate over the table row data with map()
  tableRows.map(row => {
    // open a new table row tag for each Postgres row
    htmlData += `\n<tr>`;

    // iterate over the row's data and enclose in <td> tag
    for (val in row) {
      console.log(`row[val]: ${row[val]}`);
      htmlData += `\n<td>${row[val]}</td>`;
    }

    // close the table row <tr> tag
    htmlData += `\n</tr>`;
  });

  // close the table body and script tags
  htmlData += "\n</tbody>`;</script>";

  // return the string
  return htmlData;
}


// function that will return Postgres records as an HTML table
function createProductDetailsTable(tableRows, tableCol) {
  // let htmlData = "I did get added didnt i?";
  let htmlData = "<script>var specificProductData = `<div>\n";
  // scroll through the list
  for (let i = 0; i < tableCol.length; i++) {
    // console.log(tableCol[i] + tableRows[0][tableCol[i]])
    htmlData += tableCol[i] +"&nbsp;"+ tableRows[0][tableCol[i]] +"<br>";
  }

  htmlData+="<input type='hidden' name='tablename' value='bricks'>"
  htmlData+="<input type='hidden' name='bid' value='"+tableRows[0]["bid"]+"'>"
  
  // close the div body and script tags
  htmlData += "\n</div>`;</script>";

  console.log(htmlData)

  console.log(`\ncreateHtmlForm:`);
  return htmlData;
}

// 'GET' route for the web app
app.get("/", (req, resp) => {
  console.log(`req: ${req}`);
  console.log(`resp: ${resp}`);

  // send the HTML file back to the front end
  resp.sendFile(htmlPath);
});


app.get('/productType/:productType/id/:id', (req, resp) => {
  // resp.send(req.params)
  console.log(req.params)
  console.log(req.params.productType)
  let htmlData = fs.readFileSync("./specificProduct.html", "utf8");

  if (req.params.productType="bricks"){

    let mainTable="bricks";
    let stockTable="bricksstock";
    colNames=["bid","color","size","type","count"]
    let sqlSelectRows = `SELECT ${mainTable}.bid as bid, color,size,type,count FROM ${mainTable} inner join ${stockTable} on ${mainTable}.bid=${stockTable}.bid WHERE ${mainTable}.BID = $1`;
    console.log(`sqlSelectRows: ${sqlSelectRows}`);

    client
      .query(sqlSelectRows, [req.params.id])

      .then(rowResp => {
        // get the row data from 'rows' attribute
        let rowData = rowResp.rows;
        console.log(rowData)

        // call function to create HTML data
        let html = createProductDetailsTable(rowData, colNames);
        console.log(`HTML table data: ${html}`);

        // send the HTML file data and table data back to front end
        resp.send(htmlData + `<br>` + html);
      });

  }
  
  // resp.send(htmlData );
})

app.get('/shop', (req, resp) => {
  console.log(`req: ${req}`);
  console.log(`resp: ${resp}`);

  // load the HTML file into the Node app's memory
  let htmlData = fs.readFileSync("./shop.html", "utf8");
  let sqlColNames = `SELECT * FROM information_schema.columns WHERE table_name = $1;`;
  client
      .query(sqlColNames, [brickTableName])

      .then(colResp => {
        // access the "rows" Object attr
        let colRows = colResp["rows"];

        // use map() function to create an array of col names
        let colNames = colRows.map(colKeys => {
          return colKeys["column_name"];
        });

        // concatenate another string for the table row data
        let sqlSelectRows = `SELECT * FROM ${tableName}`;
        console.log(`sqlSelectRows: ${sqlSelectRows}`);
        client
          .query(sqlSelectRows)

          .then(rowResp => {
            // get the row data from 'rows' attribute
            let rowData = rowResp.rows;

            // call function to create HTML data
            let html = createHtmlTableClickable(rowData, colNames);
            console.log(`HTML table data: ${html}`);

            // send the HTML file data and table data back to front end
            resp.send(htmlData + `<br>` + html);
          });
      });        

  // resp.sendFile(aboutHtmlPath);
})

// 'POST' route for the web app
app.post("/query", function(req, resp) {
  // parse the user's query
  let userQuery = req.body.query;
  console.log(`\nuserQuery: ${typeof userQuery}`);
  console.log(`${userQuery}`);

  // load the HTML file into the Node app's memory
  let htmlData = fs.readFileSync("./index.html", "utf8");

  // only make an API call if the user query is valid
  if (isNaN(userQuery) == false && userQuery.length > 0) {
    // concatenate an SQL string to SELECT the table column names
    let sqlColNames = `SELECT * FROM information_schema.columns WHERE table_name = $1;`;

    // create a Promise object for the query
    client
      .query(sqlColNames, [tableName])

      .then(colResp => {
        // access the "rows" Object attr
        let colRows = colResp["rows"];

        // use map() function to create an array of col names
        let colNames = colRows.map(colKeys => {
          return colKeys["column_name"];
        });

        // concatenate another string for the table row data
        let sqlSelectRows = `SELECT * FROM ${tableName} WHERE BID >= $1`;
        console.log(`sqlSelectRows: ${sqlSelectRows}`);

        client
          .query(sqlSelectRows, [userQuery])

          .then(rowResp => {
            // get the row data from 'rows' attribute
            let rowData = rowResp.rows;

            // call function to create HTML data
            let html = createHtmlTable(rowData, colNames);
            console.log(`HTML table data: ${html}`);

            // send the HTML file data and table data back to front end
            resp.send(htmlData + `<br>` + html);
          });
      });
  } else {
    // send an error message if the query is not an integer
    resp.send(
      htmlData +
        `<br><p color="red">ERROR: You must input an integer value.</p>`
    );
  }
});




var server = app.listen(port, host, function() {
  console.log(
    `\nPostgres Node server is running on port: ${server.address().port}`
  );
});