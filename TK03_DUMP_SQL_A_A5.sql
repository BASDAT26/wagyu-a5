CREATE SCHEMA TIKTAKTUK;
SET search_path TO TIKTAKTUK;


CREATE TABLE user_account (
  user_id UUID PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE ROLE (
role_id UUID PRIMARY KEY,
role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE ACCOUNT_ROLE(
role_id UUID,
user_id UUID,
PRIMARY KEY (role_id, user_id),
FOREIGN KEY (role_id) REFERENCES role(role_id),
FOREIGN KEY (user_id) REFERENCES user_account(user_id)
);

CREATE TABLE CUSTOMER (
customer_id UUID PRIMARY KEY,
full_name VARCHAR(100) NOT NULL,
phone_number VARCHAR(20),
user_id UUID NOT NULL UNIQUE,
FOREIGN KEY (user_id) REFERENCES user_account(user_id)
);

CREATE TABLE ORGANIZER(
   organizer_id UUID PRIMARY KEY,
   organizer_name VARCHAR(100) NOT NULL,
   contact_email VARCHAR(100),
   user_id UUID NOT NULL UNIQUE,


   FOREIGN KEY (user_id) REFERENCES USER_ACCOUNT(user_id)
);

CREATE TABLE VENUE(
   venue_id UUID PRIMARY KEY,
   venue_name VARCHAR(100) NOT NULL,
   capacity INTEGER NOT NULL CHECK (capacity > 0),
   address TEXT NOT NULL,
   city VARCHAR(100) NOT NULL
);

CREATE TABLE SEAT (
seat_id UUID PRIMARY KEY,
section VARCHAR(50) NOT NULL,
seat_number VARCHAR(10) NOT NULL,
row_number VARCHAR(10) NOT NULL,
venue_id UUID NOT NULL,
FOREIGN KEY (venue_id) REFERENCES VENUE(venue_id) ON DELETE CASCADE
);

CREATE TABLE EVENT(
   event_id UUID PRIMARY KEY,
   event_datetime TIMESTAMP NOT NULL,
   event_title VARCHAR(200) NOT NULL,
   venue_id UUID NOT NULL,
   organizer_id UUID NOT NULL,


   FOREIGN KEY (venue_id) REFERENCES VENUE(venue_id),
   FOREIGN KEY (organizer_id) REFERENCES ORGANIZER(organizer_id)
);

CREATE TABLE ARTIST (
    artist_id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    genre VARCHAR(100)
);

CREATE TABLE EVENT_ARTIST (
    event_id UUID NOT NULL,
    artist_id UUID NOT NULL,
    role VARCHAR(100),
    PRIMARY KEY (event_id, artist_id),
    FOREIGN KEY (artist_id) REFERENCES ARTIST(artist_id),
    FOREIGN KEY (event_id) REFERENCES EVENT(event_id)
);

CREATE TABLE TICKET_CATEGORY (
    category_id UUID PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    quota INTEGER NOT NULL CHECK (quota > 0),
    price NUMERIC(12,2) NOT NULL CHECK (price >= 0),
    tevent_id UUID NOT NULL,
    FOREIGN KEY (tevent_id) REFERENCES EVENT(event_id)
);

CREATE TABLE ORDERS (
order_id UUID PRIMARY KEY,
order_date TIMESTAMP NOT NULL,
payment_status VARCHAR(20) NOT NULL,
total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
customer_id UUID NOT NULL,


FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id)
);

CREATE TABLE TICKET (
ticket_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
ticket_code VARCHAR(100) NOT NULL UNIQUE,
tcategory_id UUID NOT NULL,
torder_id UUID NOT NULL,
FOREIGN KEY (tcategory_id) REFERENCES TICKET_CATEGORY(category_id) ON DELETE CASCADE,
FOREIGN KEY (torder_id) REFERENCES ORDERS(order_id)ON DELETE CASCADE
);

CREATE TABLE HAS_RELATIONSHIP (
seat_id UUID,
ticket_id UUID,
PRIMARY KEY(seat_id, ticket_id),
FOREIGN KEY (seat_id) REFERENCES SEAT(seat_id) ON DELETE CASCADE, 
FOREIGN KEY (ticket_id) REFERENCES TICKET(ticket_id) ON DELETE CASCADE
); 

CREATE TABLE PROMOTION (
    promotion_id UUID PRIMARY KEY,
    promo_code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(20) NOT NULL,
    discount_value NUMERIC(12,2) NOT NULL CHECK (discount_value > 0),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    usage_limit INTEGER NOT NULL CHECK (usage_limit > 0),
CONSTRAINT chk_discount_type CHECK (discount_type IN ('NOMINAL', 'PERCENTAGE')),
    CONSTRAINT chk_date CHECK (end_date >= start_date)
);


CREATE TABLE ORDER_PROMOTION (
   order_promotion_id UUID PRIMARY KEY,
   promotion_id UUID NOT NULL,
   order_id UUID NOT NULL,


   FOREIGN KEY (promotion_id) REFERENCES PROMOTION(promotion_id),
   FOREIGN KEY (order_id) REFERENCES ORDERS(order_id),
   CONSTRAINT unique_order_promo UNIQUE (order_id, promotion_id)
);