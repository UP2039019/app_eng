// https://blog.logrocket.com/crud-rest-api-node-js-express-postgresql/
// https://kb.objectrocket.com/postgresql/nodejs-express-postgresql-tutorial-part-1-960
const express = require("express");
const session = require('express-session')

const {
    Pool
} = require("pg");
const connectionString = process.env.DATABASE_URL || 'postgresql://me:password@localhost:5432/postgres'

const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");

// create a new Express app server object
const app = express();

// to keep session
// Session Setup
app.use(session({

    // It holds the secret key for session
    secret: 'Your_Secret_Key',

    // Forces the session to be saved
    // back to the session store
    resave: true,

    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
}))

// to use stylesheets in public/css/
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

// declare a constant for the PostgreSQL table
const tableName = 'bricks';
const brickTableName = 'bricks';

// use alternate localhost and the port Heroku assigns to $PORT
// const host = '0.0.0.0';
// const port = process.env.PORT || 3000;
const host = 'localhost';
const port = 8080;


// get the path for the HTML file
const htmlPath = path.join(__dirname + "/index.html");
const aboutHtmlPath = path.join(__dirname + "/about.html");

// create a new client instance with the pg Pool() method
const client = new Pool({
    connectionString,

    port: "5432",

    // ssl: {
    //   rejectUnauthorized: false
    // }
});




function formulateBricksIDList(rowData) {

    // open a <script> tag for the string
    let htmlData = "<script>var formidData = `<div>\n";
    htmlData += "<select name='bid' id='bid'>";
    for (i = 0; i < rowData.length; i++) {
        bid = rowData[i].bid;
        htmlData += "<option value='" + bid + "'>" + bid + "</option>"
    }
    htmlData += "</select>"


    // close the div body and script tags
    htmlData += "\n</div>`;</script>";

    // return the string
    return htmlData;


}




function createHtmlModelKitTableClickable(tableRows, tableCol) {
    // open a <script> tag for the string
    let htmlData = "<script>var modelkitTableData = `<thead>\n<tr>";
    console.log(`\createHtmlModelKitTableClickable:`);

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
            htmlData += "<td><a href='/productType/modelkits/id/" + row["mid"] + "'>" + row[val] + "</a></td>";
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

// function that will return Postgres records as html links in a table
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
            htmlData += "<td><a href='/productType/bricks/id/" + row["bid"] + "'>" + row[val] + "</a></td>";
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


// function that will return Postgres cart records for a specific session 
// as html links in a table
function createHtmlCartTableClickable(tableRows, tableCol) {
    // open a <script> tag for the string
    let htmlData = "<script>var cartData = `<thead>\n<tr>";
    console.log(`CreateHtmlCartTableClickable:`);

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
        let productType = "";
        if (row["itemid"].startsWith("B")) {
            productType = "bricks";
        } else if (row["itemid"].startsWith("M")) {
            productType = "modelkits";
        }
        console.log(row)
        // iterate over the row's data and enclose in <td> tag
        for (val in row) {
            console.log(`${val},row[val]: ${row[val]}`);
            htmlData += "<td><a href='/cart/sid/" + row["sid"] + "/productType/" + productType + "/id/" + row["itemid"] + "'>" + row[val] + "</a></td>";
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


function createCheckoutProductDetailsTable_ModelKits(tablename, tableRows, tableCol, countOrdered) {


    console.log("createCheckoutProductDetailsTable, modelkits")


    // console.log(sqlColNames)
    let htmlData = "<script>var specificCheckoutProductData = `<div>\n";
    // scroll through the list
    for (let i = 0; i < tableRows.length; i++) {
        console.log("row=", tableRows[i]);
        for (let j = 0; j < tableCol.length; j++) {
            console.log("vals=", tableCol[j] + tableRows[i][tableCol[j]])
            htmlData += tableCol[j] + "&nbsp;" + tableRows[i][tableCol[j]] + "<br>";
        }
        htmlData += "</br>"
    }
    htmlData += "<input name='orderCount' value='" + countOrdered + "'>"
    htmlData += "<input type='hidden' name='tablename' value='" + tablename + "'>"
    htmlData += "<input type='hidden' name=mid value='" + tableRows[0].mid + "'>"
    htmlData += "\n</div>`;</script>";
    return htmlData

}


function createCheckoutProductDetailsTable(tablename, tableRows, tableCol, countAvailable) {

    if (tablename === "bricks") {
        console.log("createCheckoutProductDetailsTable, bricks")
        console.log(countAvailable)
        // console.log(sqlColNames)
        let htmlData = "<script>var specificCheckoutProductData = `<div>\n";
        // scroll through the list
        for (let i = 0; i < tableCol.length; i++) {
            // console.log(tableCol[i] + tableRows[0][tableCol[i]])

            if (tableCol[i] == "count") {
                htmlData += "<input name='orderCount' value='" + tableRows[0][tableCol[i]] + "'>"
            } else {
                htmlData += tableCol[i] + "&nbsp;" + tableRows[0][tableCol[i]] + "<br>";
                htmlData += "<input type='hidden' name='" + tableCol[i] + "' value='" + tableRows[0][tableCol[i]] + "'>"
            }
        }
        htmlData += "<input type='hidden' name='count' value='" + countAvailable + "'>"
        htmlData += "<input type='hidden' name='tablename' value='" + tablename + "'>"



        htmlData += "\n</div>`;</script>";
        console.log(htmlData)
        return htmlData;

    }



}


// function that will return Postgres records as an HTML table
function createProductDetailsTable(productType, tableRows, tableCol) {
    // let htmlData = "I did get added didnt i?";

    if (productType === "bricks") {
        let htmlData = "<script>var specificProductData = `<div>\n";
        // scroll through the list
        for (let i = 0; i < tableCol.length; i++) {
            // console.log(tableCol[i] + tableRows[0][tableCol[i]])
            htmlData += tableCol[i] + "&nbsp;" + tableRows[0][tableCol[i]] + "<br>";
            if (tableCol[i] == "count") {
                htmlData += "<input type='hidden' name='count' value='" + tableRows[0][tableCol[i]] + "'>"
            }
        }

        htmlData += "<input type='hidden' name='tablename' value='bricks'>"
        htmlData += "<input type='hidden' name='bid' value='" + tableRows[0]["bid"] + "'>"

        // close the div body and script tags
        htmlData += "\n</div>`;</script>";

        console.log(htmlData)

        console.log(`\ncreateHtmlForm:`);
        return htmlData;
    } else if (productType === "modelkits") {

        // htmlData=createHtmlModelKitTable(script_var_name,tableRows, tableCol)



        // open a <script> tag for the string
        let htmlData = "<script>var specificProductData = `<div>\n";
        console.log(`\createHtmlModelKitTableClickable:`, productType);
        console.log(tableRows)
        console.log(tableCol)

        for (let i = 0; i < tableRows.length; i++) {
            for (let j = 0; j < tableCol.length; j++) {
                htmlData += tableCol[j] + "&nbsp;" + tableRows[i][tableCol[j]] + "<br>";
            }
            htmlData += "</br>"

        }

        htmlData += "<input type='hidden' name='tablename' value='modelkits'>"
        htmlData += "<input type='hidden' name='mid' value='" + tableRows[0]["mid"] + "'>"
        // close the div body and script tags
        htmlData += "\n</div>`;</script>";


        // return the string
        return htmlData;


    }

}


function postCheckOutTableModifyBricksStore(bid, countRequired) {

    let sqlSelectRows = `SELECT count from  bricksstock WHERE BID = $1`;
    console.log("query", sqlSelectRows, bid);
    client
        .query(sqlSelectRows, [bid])

        .then(rowResp => {
            let rowData = rowResp.rows;
            countAvailable = rowData[0].count

            console.log(countAvailable)
            //can we update the table here
            let new_count = parseInt(countAvailable) - parseInt(countRequired)
            let sqlUpdate = `Update bricksstock set count=$1 WHERE BID = $2`;
            console.log(`sqlUpdate: ${sqlUpdate}`);
            client
                .query(sqlUpdate, [new_count, bid])
                .then(rowResp => {
                    console.log("Updated ", bid)
                    // return 0;                    
                });
        });
}

function postCheckOutTableDeleteSessionCartRow(sid, itemid) {

    let sqlDelete = `Delete from sessioncart where SID=$1 and  itemid = $2`;
    console.log(`sqlDelete: ${sqlDelete}`);
    client
        .query(sqlDelete, [sid, itemid])
        .then(rowResp => {
            console.log("Deleted ", sid, itemid)
            return 0;
        });

}


////////////////////////////////////////////////
////////////////////////////////////////////////
//////////////// apis //////////////////////////
////////////////////////////////////////////////
////////////////////////////////////////////////
// 'GET' route for the web app
app.get("/", (req, resp) => {
    // console.log(`req: ${req}`);
    // console.log(`resp: ${resp}`);

    // // can we set the session name here
    // req.session.name = 'thisguy'
    // // ideally should be user name or ip address

    // // send the HTML file back to the front end
    // resp.sendFile(htmlPath);


    req.session.name = 'thisguy'
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

                    //now prepare the html table for models
                    let modelkitTableName = "modelkit"
                    let sqlModelKitSelectRows = `SELECT mid,name FROM ${modelkitTableName}`;
                    console.log(`sqlSelectRows: ${sqlSelectRows}`);
                    client
                        .query(sqlModelKitSelectRows)
                        .then(rowResp => {
                            // get the row data from 'rows' attribute
                            let rowData = rowResp.rows;
                            let colNames = ['MID', "name"]
                            let modelKitshtml = createHtmlModelKitTableClickable(rowData, colNames);


                            let cartLinkData="<script>var cartLinkData = `<div>\n";
                            cartLinkData+="<a href='/cart/sid/"+req.session.name+"'>" + "View Cart" + "</a>";
                            cartLinkData+="\n</div>`;</script>";

                            // send the HTML file data and table data back to front end
                            resp.send(htmlData + `<br>` + html + `<br>` + modelKitshtml+cartLinkData);

                        });
                });
        });


});







app.get("/addBricks", (req, resp) => {
    // load the HTML file into the Node app's memory
    let htmlData = fs.readFileSync("./addbricks.html", "utf8");
    resp.send(htmlData);

});



app.post("/postAddBricks", (req, resp) => {
    console.log(`req: ${req}`);
    console.log(`resp: ${resp}`);

    let bid = req.body.bid;
    let color = req.body.color;
    let size = req.body.size;
    let type = req.body.type;

    let addBricksSql = "INSERT INTO bricks (bid,color, size,type) VALUES ($1,$2,$3,$4);"
    client
        .query(addBricksSql, [bid, color, size, type])
        .then(rowResp => {
            resp.send("Inserted bricks");
        });


});



app.get("/addBricksStock", (req, resp) => {
    // load the HTML file into the Node app's memory
    let htmlData = fs.readFileSync("./addBricksStock.html", "utf8");

    let sqlBIDs = "select bid from bricks;";
    client
        .query(sqlBIDs)
        .then(rowResp => {
            // get the row data from 'rows' attribute
            let rowData = rowResp.rows;
            console.log(rowData)

            html = formulateBricksIDList(rowData);
            resp.send(htmlData + html);


        });
});



app.post("/postAddBricksStock", (req, resp) => {
    console.log(`req: ${req}`);
    console.log(`resp: ${resp}`);

    let bid = req.body.bid;
    let count = req.body.count;

    let sqlUpsertBricksStock = `INSERT INTO bricksstock (bid, count) VALUES($1,$2) ON CONFLICT (bid) DO UPDATE SET count = EXCLUDED.count`;
    console.log(`sqlUpsertBricksStock: ${sqlUpsertBricksStock}`);
    client
        .query(sqlUpsertBricksStock, [bid, count])
        .then(rowResp => {
            resp.send("Inserted/Updated bricks stock count");
        });
});






app.get('/productType/:productType/id/:id', (req, resp) => {
    // resp.send(req.params)
    console.log(req.params)
    console.log(req.params.productType)
    let htmlData = fs.readFileSync("./specificProduct.html", "utf8");

    if (req.params.productType === "bricks") {
        console.log("For bricks")
        let mainTable = "bricks";
        let stockTable = "bricksstock";
        colNames = ["bid", "color", "size", "type", "count"]
        let sqlSelectRows = `SELECT ${mainTable}.bid as bid, color,size,type,count FROM ${mainTable} inner join ${stockTable} on ${mainTable}.bid=${stockTable}.bid WHERE ${mainTable}.BID = $1`;
        console.log(`sqlSelectRows: ${sqlSelectRows}`);

        client
            .query(sqlSelectRows, [req.params.id])

            .then(rowResp => {
                // get the row data from 'rows' attribute
                let rowData = rowResp.rows;
                console.log(rowData)

                // call function to create HTML data
                let html = createProductDetailsTable(req.params.productType, rowData, colNames);
                console.log(`HTML table data: ${html}`);

                // send the HTML file data and table data back to front end
                resp.send(htmlData + `<br>` + html);
            });

    } else if (req.params.productType === "modelkits") {
        console.log("For modelkits")
        colNames = ["mid", "name", "bid", "bricksrequired", "available"]
        let sqlSelectRows = `select modelkits.mid as mid,name,bricksstock.bid as bid,modelkitComposition.count as bricksrequired, bricksstock.count as available `;
        sqlSelectRows += `from modelkits inner join modelkitComposition on modelkits.mid=modelkitComposition.mid inner join bricksstock on modelkitComposition.bid=bricksstock.bid `;
        sqlSelectRows += `where modelkits.mid=$1`
        console.log(`sqlSelectRows: ${sqlSelectRows}`);
        client
            .query(sqlSelectRows, [req.params.id])

            .then(rowResp => {
                // get the row data from 'rows' attribute
                let rowData = rowResp.rows;
                console.log(rowData)

                // call function to create HTML data
                let html = createProductDetailsTable(req.params.productType, rowData, colNames);
                console.log(`HTML table data: ${html}`);

                // send the HTML file data and table data back to front end
                resp.send(htmlData + `<br>` + html);
            });

    }

    // resp.send(htmlData );
})




// this one to show all contents of cart
app.get('/cart/sid/:sid', (req, resp) => {
    console.log("cart specific product")
    console.log(req.params)
    console.log(req.params.sid)
    let sid = req.params.sid
    let htmlData = fs.readFileSync("./cart.html", "utf8");
    let sessionCartDetailsQuery = `SELECT * FROM sessioncart WHERE sid = $1;`;
    client
        .query(sessionCartDetailsQuery, [sid])
        .then(rowResp => {
            colNames = ["sid", "itemid", "count"]
            let rowData = rowResp.rows;

            // call function to create HTML data
            let html = createHtmlCartTableClickable(rowData, colNames);


            let form_html = "<script>var checkOutData = `<div>\n";
            form_html += "<input type='hidden' name='sid' value='" + sid + "'>"
            form_html += "\n</div>`;</script>";

            // console.log(htmlData + `<br>` + html+ `<br>` +form_html)


            resp.send(htmlData + `<br>` + html + `<br>` + form_html);
        });

});

// this one to modify check out specific details
app.get('/cart/sid/:sid/productType/:productType/id/:id', (req, resp) => {
    console.log("cart specific product")
    console.log(req.params)
    console.log(req.params.productType)
    let htmlData = fs.readFileSync("./specificProductCheckOut.html", "utf8");
    let sessioncartTable = "sessioncart"
    if (req.params.productType === "bricks") {


        let sid = req.params.sid
        let bid = req.params.id

        let sqlSelectRows = `SELECT sid, itemid, count FROM ${sessioncartTable} WHERE SID = $1 and itemid=$2`;
        console.log(`sqlSelectRows: ${sqlSelectRows}`);

        client
            .query(sqlSelectRows, [sid, bid])

            .then(rowResp => {
                // get the row data from 'rows' attribute
                let colNames = ["sid", "itemid", "count"]
                let ProductrowData = rowResp.rows;
                console.log(ProductrowData)


                let bricksstockTableName = "bricksstock"

                let sqlSelectRows = `SELECT count from  ${bricksstockTableName} WHERE BID = $1`;
                console.log(`sqlSelectRows: ${sqlSelectRows}`);
                client
                    .query(sqlSelectRows, [bid])

                    .then(rowResp => {
                        let rowData = rowResp.rows;
                        countAvailable = rowData[0].count

                        console.log(countAvailable)
                        // call function to create HTML data
                        let html = createCheckoutProductDetailsTable(req.params.productType, ProductrowData, colNames, countAvailable);


                        // console.log(`HTML table data: ${html}`);

                        // send the HTML file data and table data back to front end
                        resp.send(htmlData + `<br>` + html);

                    });


            });

    } else if (req.params.productType === "modelkits") {
        console.log("Generating modelkits item")

        let sid = req.params.sid
        let mid = req.params.id

        console.log("For modelkits")

        let sqlSelectRows = `SELECT sid, itemid, count FROM ${sessioncartTable} WHERE SID = $1 and itemid=$2`;
        console.log(`sqlSelectRows: ${sqlSelectRows}`);

        client
            .query(sqlSelectRows, [sid, mid])

            .then(rowResp => {
                let rowData = rowResp.rows;
                let countOrdered = rowData[0].count

                colNames = ["mid", "name", "bid", "bricksrequired", "available"]
                let sqlSelectRows = `select modelkits.mid as mid,name,bricksstock.bid as bid,modelkitComposition.count as bricksrequired, bricksstock.count as available `;
                sqlSelectRows += `from modelkits inner join modelkitComposition on modelkits.mid=modelkitComposition.mid inner join bricksstock on modelkitComposition.bid=bricksstock.bid `;
                sqlSelectRows += `where modelkits.mid=$1`
                console.log(`sqlSelectRows: ${sqlSelectRows}`);

                client
                    .query(sqlSelectRows, [req.params.id])
                    .then(rowResp => {
                        let rowData = rowResp.rows;
                        console.log(rowData)

                        // call function to create HTML data
                        let html = createCheckoutProductDetailsTable_ModelKits(req.params.productType, rowData, colNames, countOrdered);
                        console.log(`HTML table data: ${html}`);
                        // send the HTML file data and table data back to front end
                        resp.send(htmlData + `<br>` + html);

                    });

            });

    }




});




// // this one is for after checking out
app.post("/postCheckout", function(req, resp) {
    console.log('postCheckout');
    let sessionIDForm = req.body.sid;
    let sessionIDSystem = req.session.name;
    console.log(sessionIDForm, sessionIDSystem)

    //use the form one anyway

    // now write query to subract




    //   // load the HTML file into the Node app's memory
    //   let htmlData = fs.readFileSync("./showcheckout.html", "utf8");

    // get all rows for that session name
    let sqlSelectRows = `SELECT * FROM sessioncart WHERE sid = $1`;
    console.log(`sqlSelectRows: ${sqlSelectRows}`);
    client
        .query(sqlSelectRows, [req.session.name])

        .then(rowResp => {
            let rowData = rowResp.rows;

            // iterate over the table row data with map()
            rowData.map(row => {
                console.log(row)
                // iterate over the row's data and enclose in <td> tag
                let item_id = row["itemid"]
                let count_ordered = row["count"]
                console.log("itemid", item_id);
                console.log("count", count_ordered);

                if (item_id.startsWith("B")) {
                    // can we modify bricksstock table using the function
                    postCheckOutTableModifyBricksStore(item_id, count_ordered);

                    // can we delete row from sessioncart table
                    postCheckOutTableDeleteSessionCartRow(req.session.name, item_id);

                } else if (item_id.startsWith("M")) {

                    console.log("ITs going to be a model");

                    let sqlGetBricks = "select modelkitComposition.bid as bid, modelkitComposition.count as countcompositionrequired from  ";
                    sqlGetBricks += "modelkits inner join modelkitComposition on modelkits.mid=modelkitComposition.mid ";
                    sqlGetBricks += "where modelkits.mid=$1"
                    console.log(sqlGetBricks, [item_id])
                    client
                        .query(sqlGetBricks, [item_id])
                        .then(rowResp => {
                            let bricksRowData = rowResp.rows;
                            console.log("Rows to update ", bricksRowData);
                            bricksRowData.map(row => {
                                console.log("Row to update ", row);

                                let brick_item_id = row["bid"];
                                let countcompositionrequired = row["countcompositionrequired"];
                                console.log("vals", countcompositionrequired, count_ordered)
                                let totalcountcompositionrequired = parseInt(countcompositionrequired) * parseInt(count_ordered);

                                console.log("to update", totalcountcompositionrequired)

                                postCheckOutTableModifyBricksStore(brick_item_id, totalcountcompositionrequired);

                            });

                        });

                    //now delete from sessions cart
                    postCheckOutTableDeleteSessionCartRow(req.session.name, item_id);

                }




            });

        });
    // resp.send("Check out complete");
    return resp.redirect('/');


});

// 'POST' route for the web app
// this one is for adding specific products to cart
app.post("/addtocart", function(req, resp) {
    console.log('addtocart')


    //update or insert into table sessioncookie


    // console.log(`resp: ${resp}`);
    let tablename = req.body.tablename;
    console.log("check in table", tablename);
    let bid = "0";
    if (tablename === "bricks") {
        console.log("In bricks")
        if (req.body.bid != undefined) {
            bid = req.body.bid;
        } else {
            bid = req.body.itemid;
        }

        let orderCount = req.body.orderCount;
        let count = req.body.count;
        if (parseInt(orderCount) > parseInt(count)) {
            console.log("Not enough in stock");
            resp.send("Not enough in stock");
        } else {
            // add to session cart table
            console.log("Putting values")
            console.log(req.session.name)
            console.log(bid)
            console.log(tablename)
            console.log(orderCount)
            console.log(count)

            // apply insert on conflict to make sure that update happens in case
            // item already exists
            let sqlUpsertsessioncookie = `INSERT INTO sessioncart (SID, itemid, count) VALUES($1,$2, $3) ON CONFLICT (SID,itemid) DO UPDATE SET count = EXCLUDED.count`;
            console.log(`sqlUpsertsessioncookie: ${sqlUpsertsessioncookie}`);
            client
                .query(sqlUpsertsessioncookie, [req.session.name, bid, orderCount])

                .then(rowResp => {
                    // get the row data from 'rows' attribute
                    let rowData = rowResp.rows;
                    console.log(rowData)
                    // send the HTML file data and table data back to front end
                    // resp.send("Inserted/Modified into session cart");
                    return resp.redirect('/');
                });



        }

    } else if (tablename === "modelkits") {


        // check if the composition of model
        //the number of bricks are present or not
        let orderCount = req.body.orderCount;
        console.log("mods are", req.body.mid);
        let mid = req.body.mid;
        // if (req.body.mid.length>1){
        //   mid = req.body.mid[0];
        // }      
        let sid = req.session.name
        console.log("sid =", sid)

        console.log("in modelkits")
        console.log(mid, orderCount)


        // get composition of model

        colNames = ["bid", "bricksrequired", "available"]
        let sqlSelectRows = `select bricksstock.bid as bid,modelkitComposition.count as bricksrequired, bricksstock.count as available `;
        sqlSelectRows += `from modelkits inner join modelkitComposition on modelkits.mid=modelkitComposition.mid inner join bricksstock on modelkitComposition.bid=bricksstock.bid `;
        sqlSelectRows += `where modelkits.mid=$1`
        console.log(`sqlSelectRows: ${sqlSelectRows}`);
        client
            .query(sqlSelectRows, [mid])

            .then(rowResp => {
                // get the row data from 'rows' attribute
                let rowData = rowResp.rows;
                console.log("all rows are", rowData)
                console.log("1st rows is", rowData[0])

                // run check
                let within_limits = 1;
                for (i = 0; i < rowData.length; i++) {
                    if (parseInt(rowData[i]["bricksrequired"]) * parseInt(orderCount) > parseInt(rowData[i]["available"])) {
                        within_limits = 0;
                        break;
                    }
                    console.log(rowData[i]["bricksrequired"], "*", orderCount, rowData[i]["available"]);
                }

                if (within_limits == 0) {
                    resp.send("Not enough bricks to build the number of models you selected. Reduce the number of models selected")
                } else {
                    // query to add to cart

                    // apply insert on conflict to make sure that update happens in case
                    // item already exists
                    let sqlUpsertsessioncookie = `INSERT INTO sessioncart (SID, itemid, count) VALUES($1,$2, $3) ON CONFLICT (SID,itemid) DO UPDATE SET count = EXCLUDED.count`;
                    console.log(`sqlUpsertsessioncookie: ${sqlUpsertsessioncookie}`);
                    client
                        .query(sqlUpsertsessioncookie, [req.session.name, mid, orderCount])

                        .then(rowResp => {
                            // get the row data from 'rows' attribute
                            let rowData = rowResp.rows;
                            console.log(rowData)
                            // send the HTML file data and table data back to front end
                            resp.send("Inserted/Modified into session cart");
                        });




                }




            });

    }

});



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