create database Bamazon;

use Bamazon;

create table t_products (
	item_id int not null auto_increment
    ,product_name varchar (500) not null
    ,department_name varchar(64) not null
    ,price decimal(9,2) not null
    ,stock_quantity int not null
   ,primary key (item_id)
);

insert t_products values
(1,'SE KHK6320 Outdoor Tanto Knife with Fire Starter','home improvement tools',7.45,30),
(2,'LuxPower Tactical V1000 LED Flashlight 2 PACK','home improvement tools',14.78,80),
(3,'Vastar 3 Pack 23.6 Inch Drain Snakes Hair Clog Remover Cleaning Tool','home improvement tools',6.79,120),
(4,'MudGear Compression Socks','Athletic Clothing',29.46,75),
(5,'4ucycling Compression Tight Shirt Base Layer Breathable Sleeves','Athletic Clothing',13.42,80),
(6,'Angerella Women Retro Vintage Cute Hollow Out One Piece Bathing Suits ','Athletic Clothing',19.99,130),
(7,'Kitbest Mini Bluetooth OBD2 ','automotive',10.99,30),
(8,'Tire Gauge Pancellent Digital Air ','automotive',6.32,80),
(9,'Udiag CR600 E OBD OBD II Scanner Auto Engine Error Codes Reader','automotive',21,120),
(10,'OEMTOOLS 24455 PPS-X Personal Power Source with Smart Jump Cables','automotive',81.48,75),
(11,'Play-Doh 10-Pack of Colors ','toys and games',7.99,80),
(12,'Emoji Universe : Emoji Easter Eggs, 24-Pack','toys and games',9.95,30),
(13,'Mega Bloks 80-Piece Big Building Bag, Classic','toys and games',13.99,80),
(14,'Little Tikes Easy Score Basketball Set - 3 Ball','toys and games',34.99,120),
(15,'D-FantiX Cyclone Boys 3x3 Speed Cube Stickerless Magic Cube 3x3x3 Puzzles Toys','toys and games',7.99,75);

update t_products
set department_name = 'athletic clothing'
where department_name = 'Athletic Clothing';

create table t_departments (
	department_id int not null,
    department_name varchar (64) not null,
    over_head_cost decimal (9,2) not null,
    total_sales decimal (11,2) not null
);

alter table t_products
add product_sales decimal (11,2);

update t_products
set stock_quantity = 30
	,product_sales = 0;
    
alter table t_products
modify column stock_quantity int(11) unsigned;

alter table t_departments
modify column department_id int not null auto_increment primary key;

insert t_departments (
	department_name
    ,over_head_cost
    ,total_sales
) select distinct department_name, 0, 0 from t_products;

update t_departments
set over_head_cost = 54929
where department_id = 1;

update t_departments
set over_head_cost = 65738
where department_id = 2;

update t_departments
set over_head_cost = 23413
where department_id = 3;

update t_departments
set over_head_cost = 30585
where department_id = 4;

