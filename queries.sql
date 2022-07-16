
DROP TABLE IF EXISTS bricks CASCADE;

CREATE TABLE bricks (
  BID VARCHAR(30) PRIMARY KEY,
  color VARCHAR(30),
  size VARCHAR(30),
  type VARCHAR(30)
);


INSERT INTO bricks (BID,color, size,type)
  VALUES 
		('B1','Green','Medium','square'),
		('B2','Brown','Medium','square')
  		;






DROP TABLE IF EXISTS bricksStock CASCADE;




CREATE TABLE bricksStock
(
  BID VARCHAR(30)  NOT NULL ,
  count integer,
  PRIMARY KEY (BID),
  CONSTRAINT fk_brick
  	FOREIGN KEY(BID) 
  	REFERENCES bricks(BID)

);


INSERT INTO bricksStock (BID, count)
  VALUES 
		('B1','3842'),
		('B2','5989')
		;




DROP TABLE IF EXISTS modelkits CASCADE;

CREATE TABLE modelkits (
  MID VARCHAR(30) PRIMARY KEY,
  name VARCHAR(30)
);


INSERT INTO modelkits(MID,name)
  VALUES 
		('M1','Bonsai')
		;



DROP TABLE IF EXISTS modelkitComposition CASCADE;

CREATE TABLE modelkitComposition(
  MID VARCHAR(30),
  BID varchar(40),
  count integer,

	CONSTRAINT fk_model
	  	FOREIGN KEY(BID) 
	  	REFERENCES bricks(BID),
	  	FOREIGN KEY(MID) 
	  	REFERENCES modelkits(MID)
);


INSERT INTO modelkitComposition(MID,BID,count)
  VALUES 
		('M1','B1','500'),
		('M1','B2','300')		
		;


DROP TABLE IF EXISTS sessioncart CASCADE;

CREATE TABLE sessioncart (
  SID varchar,
  itemid varchar(40),
  count integer,
  PRIMARY KEY(SID,itemid)
  
);