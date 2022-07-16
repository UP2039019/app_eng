# Online shop
This is a sample online lego shop that sells lego bricks as well as model kits.

# Features
- Add bricks
- Add bricks stock
- View the shop
- View individual product
- Add products to cart
- View Cart
- Modify cart items individually
- Check out cart


## Getting Started

Follow instructions below to have a copy of this project up and running on your local machine for development and testing purposes. 

### Prerequisites

You will need to have the following software installed on your system

- [Nodejs](https://nodejs.org/en/download/), a JavaScript runtime that lets you run applications outside the browser
- NPM, a package manager for Nodejs software packages (Comes with Node)
- Postgresql installation 



### Installing

Clone the repository to your local machine

```
git clone https://github.com/UP2039019/app_eng.git
```

Navigate into root of repository

```
cd online-shop
```

Install application dependencies

```
npm install
```



### Setting up the Database

If you have an existing postgresql databse installed, make sure that it is running and you are connected to the database as aadmin
From the command line of the database run the following commands
```
CREATE ROLE me WITH LOGIN PASSWORD 'password';
ALTER ROLE me CREATEDB;
\q
```

Note that there will be an existing database with name "postgres"
We want to load our table schema into the databse "postgres".
Make sure you are in the root folder of the project
```
psql -d postgres -U me -f queries.sql
```
queries.sql contains the SQL queries to set up the tables.

#### Schema Explanation

The database consists of 5 tables.
Bricks - contains the brick id (BID), size, type and color of each type of bricks
BricksStock - contains the brick id (BID) and the number of such bricks in stock (count)
ModelKits - contains the different composite models that the shop sells. It has two attributes, Model ID (MID) and name
ModelKitsComposition - defines the brick composition of each model. It contains three attributes, Model ID (MID), Brick ID (BID) and the number of bricks required (count)

The ER diagram is as follows
![ER Diagram](public/static/ERDiagram.png)

The relationship between ModelKits and bricksStock is shown with an example below.
![BricksStock](public/static/ModelKits.png)

### Database Connection
Once the database schema is established, the code should be able to connect to the database and perform necessary functionalities.
However I am highlighting the place which needs to be modified in case of changes in the database connections.

In the file index.js

```
...
const {
    Pool
} = require("pg");
const connectionString = process.env.DATABASE_URL || 'postgresql://me:password@localhost:5432/postgres'
...
```

"me" is the name of the user, "password" is the password for the user, "localhost" is the server, "5432" is the port and "postgres" is the name of the database.




## Running the application

Run the command below in the project's root folder
```
npm start
```
The project is accessible by http://localhost:8080/

## API details

### Front End APIs

1. / - Shows the shop (http://localhost:8080/)
![Shop](public/static/api_pics/root.png)

2. /productType/:productType/id/:id - Shows individual details of the product. Below shows a brick detail
![BrickDetails](public/static/api_pics/producttype_id_bricks.png)
Example: http://localhost:8080/productType/bricks/id/B1

Below shows the modelkit detail which is a composition of many bricks
![ModelKitDetails](public/static/api_pics/producttype_id_model.png)
Example: http://localhost:8080/productType/modelkits/id/M1

3. /cart/sid/:sid - Shows the cart details for the individual user. The session ID is saved when the user opens the root link.
![CartDetails](public/static/api_pics/cart_details.png)
Example: http://localhost:8080/cart/sid/thisguy

4. /cart/sid/:sid/productType/:productType/id/:id - Used to miodify specific products in cart
![ModifyCartDProduct](public/static/api_pics/modifyCartItem.png)
Example: http://localhost:8080/cart/sid/thisguy/productType/bricks/id/B1
[Note that this link will work only when the item B1 has already been added to the cart]

5. /addBricks - Gives the form to add a new brick to the shop
![AddBricks](public/static/api_pics/addBrick.png)
Example: http://localhost:8080/addBricks


6. /addBricksStock - Gives the form to add stock of existing brick to the shop
![AddBricks](public/static/api_pics/addBrickStock.png)
Example: http://localhost:8080/addBricksStock
[Note that there is a drop down which allows us to modify stock of only existing bricks]


### Back End APIs

1. /addtocart - Adds a single product to the cart (sessioncart table). Before that it checks if the number of items mentioned is present in the stocks table. In case of modelkits, it first extracts the composition bricks of that model and checks if the requisite number of bricks of each type are present in the database. In case any one brick is not sufficient, it gives an error message to the user.

Below shows user adding 10 ModelKit Bonsai (M1). But enough B1 bricks are not there.
![AddManyModels](public/static/api_pics/addCartFail/adding.png)
User will get an error message
![FailureToAdd](public/static/api_pics/addCartFail/failing.png)

2. /postCheckout - Completes the transaction. It modifies two tables. Firstly it modifies the bricksstock table and subtracts the number of bricks of each type that are being bought. In case of modelkits it finds all the composite bricks and reduces them individually. Then it goes to the sessioncart table and deletes the entries for the current user, thereby making the cart empty.

3. /postAddBricks - Inserts into the table bricks to contain the new brick type introduced.

4. /postAddBricksStock - Inserts or updates the table bricksstock to contain the number of bricks mentioned


## Design Consideration

### ModelKits and Bricks
While modelkits are composed of bricks, they are represented separately in the databse. There is a bricks table which contains the name and design of each brick type. The modelkits table has a name and a modelkit ID. The two are connected in the modelkits composition table where, for each model kit id we mention the corresponding brick IDs and the count required. 

![BricksStock](public/static/ModelKits.png)
For example, in the figure above the modelkit M1 is shown to require 700 B1 bricks and 500 B2 bricks. When a customer places an order for 2 M1 model kits, the system will perform a join query to extract the number of bricks required and the number present for each composite brick of the model kit M1.

### Ordering ModelKits and Bricks separately
The above separation allows the user to order modelkits and bricks which constitute the modelkit, separately.
![CartMix](public/static/api_pics/decoupling/cart.png)

Above image shows a cart that contains model kit M1 and brick B1
If we check the modelkit M1, we will see that it also contains the brick B1.
![ModelKitM1](public/static/api_pics/decoupling/modelkit_bricks.png)
Thus the user is able to order Modle Kit M1 which contains brick B1 and brick B1 separately.


## Future Scope

1. Customer recommendations on model kits
2. Customer placing order for unavailable items

## Difference between github source code and zipped file

The github version is modified so that it can run in heroku.
The zipped version is enabled to run in local machine.

The differences are as follows.

### For heroku (github version)

In index.js

```
...

const host = '0.0.0.0';
const port = process.env.PORT || 3000;

...

const client = new Pool({
    connectionString,

    port: "5432",

    ssl: {
      rejectUnauthorized: false
    }
});

...

```

### For local machine (zipped version)

```
...

const host = 'localhost';
const port = 8080;

...
const client = new Pool({
    connectionString,

    port: "5432",

    // ssl: {
    //   rejectUnauthorized: false
    // }
});

...

```



## Built With

* [Expressjs](https://expressjs.com/) - Web framework used
* [PostgreSQL](https://www.postgresql.org/) - Database

## License

This project is licensed under the MIT License

## Acknowledgments


