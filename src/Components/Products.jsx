// #region  H E A D E R
// <copyright file="Products.js" company="MicroCODE Incorporated">Copyright © 2022 MicroCODE, Inc. Troy, MI</copyright><author>Timothy J. McGuire</author>
// #region  P R E A M B L E
// #region  D O C U M E N T A T I O N
/*
 *      Title:    MIT xPRO React Shopping Cart
 *      Module:   Modules (./Products.js)
 *      Project:  React Shopping Cart
 *      Customer: MIT xPRO
 *      Creator:  MicroCODE Incorporated
 *      Date:     June 2022
 *      Author:   Timothy J McGuire
 *
 *      Designed and Coded: 2022 MicroCODE Incorporated
 *
 *      This software and related materials are the property of
 *      MicroCODE Incorporated and contain confidential and proprietary
 *      information. This software and related materials shall not be
 *      duplicated, disclosed to others, or used in any way without the
 *      written of MicroCODE Incorported.
 *
 *
 *      DESCRIPTION:
 *      ------------
 *
 *      This module implements MicroCODE's React Shoping Cart.
 *
 *
 *      REFERENCES:
 *      -----------
 *
 *      1. MicroCODE JavaScript Style Guide
 *         Local File: MCX-S02 (Internal JS Style Guide).docx
 *         https://github.com/MicroCODEIncorporated/JavaScriptSG
 *
 *
 *
 *      DEMONSTRATION VIDEOS:
 *      ---------------------
 *
 *      1. ...
 *
 *
 *
 *      MODIFICATIONS:
 *      --------------
 *
 *  Date:         By-Group:   Rev:     Description:
 *
 *  13-Jun-2022   TJM-MCODE  {0001}    New module for MIT xPRO WEEK 19.
 *  21-Jun-2022   TJM-MCODE  {0002}    Refactored to React App via create-react-app (CRA)
 *
 *
 */

// #endregion
// #endregion
// #endregion

import React from "react";
import Axios from "axios";
import
{
    Button,
    Container,
    Row,
    Col,
    Image

} from "react-bootstrap";

// import a working Accordion for React
import {MDBAccordion, MDBAccordionItem} from 'mdb-react-ui-kit';

// import images
import apple from '../Images/apple.png';
import orange from '../Images/orange.png';
import beans from '../Images/beans.png';
import cabbage from '../Images/cabbage.png';
import restock from '../Images/restock.jpg';

// #region  J A V A S C R I P T
// #region  F U N C T I O N S

// #region  C O N S T A N T S

// Product defintions from Database
const products = [
    {name: "Apple", country: "Italy", cost: 3, quantity: 10, image: apple},
    {name: "Orange", country: "Spain", cost: 4, quantity: 3, image: orange},
    {name: "Beans", country: "USA", cost: 2, quantity: 5, image: beans},
    {name: "Cabbage", country: "USA", cost: 1, quantity: 8, image: cabbage}
];

// #endregion

// #region  P R I V A T E   F I E L D S

// #endregion

// #region  E N U M E R A T I O N S

// #endregion

// #region  C O M P O N E N T – P U B L I C

/*
 * The PRODUCTS COMPONENT.
 */
export default function Products()
{
    const [items, setItems] = React.useState(products);
    const [cart, setCart] = React.useState([]);

    //  Fetch Data
    const {useState} = React;
    const [query, setQuery] = useState('http://localhost:1337/graphql?query={ fruits { data { id attributes { name cost country quantity } } } }');
    const [foodSupply, doFetch] = useDataApi(
        'http://localhost:1337/graphql?query={ fruits { data { id attributes { name cost country quantity } } } vegetables { data { id attributes { name cost country quantity } } } }',
        {
            data: [],
        }
    );

    console.log(`Rendering Products ${JSON.stringify(foodSupply)}`);

    // A D D -- adds an item to the Cart
    const addToCart = (e) =>
    {
        let name = e.currentTarget.name;
        let quantity = e.currentTarget.max;
        let newItems = [];

        console.log(`name=${name} quantity=${quantity}`);

        // check if its in stock ie item.quantity > 0
        // if so remove from Product List
        if (quantity > 0)
        {
            // get item with name from stock and update stock
            let item = items.filter((item) => item.name === name);

            console.log(`Adding Item to Cart: ${JSON.stringify(item)}`);

            newItems = items.map((item) =>
            {
                if (item.name === name)
                {
                    item.quantity--;
                    quantity--;
                }
                return item;
            });

            setCart([...cart, ...item]);
            setItems([...newItems]);
        }

        if (quantity <= 0)
        {
            newItems = items.filter((item) =>
            {
                return (item.name !== name);
            });
        }

        setItems([...newItems]);
    };

    // D E L E T E -- delete item from Cart, adds back to stock
    const deleteCartItem = (index) =>
    {
        let name = cart[index].name;
        let country = cart[index].country;

        console.log(`name=${name} index=${index}`);

        // get item with name from stock and update stock
        let item = items.filter((item) => item.name === name);

        console.log(`Returning Item to Stock: ${JSON.stringify(item)}`);

        let restocked = false;

        let newItems = items.map((item) =>
        {
            if (item.name === name)
            {
                item.quantity++;
                restocked = true;
            }
            return item;
        });

        if (!restocked)
        {
            // Make available in Products List again
            newItems.push({name: name, country: country, cost: 1, quantity: 1, image: restock});
        };

        setItems([...newItems]);

        let newCart = cart.filter((item, i) => index !== i);

        setCart(newCart);
    };

    // P R O D U C T S  L I S T -- all the Products available
    let list = items.map((item, index) =>
    {
        return (
            <li key={index}>
                <Image src={items[index].image} width={70} roundedCircle></Image>
                <Button variant="primary" size="large">
                    {item.name} Cost ${item.cost} Available: {item.quantity}
                </Button>
                <br />
                <input name={item.name} max={item.quantity} type="submit" value="Add to Cart" onClick={addToCart}></input>
            </li>
        );
    });

    // S H O P P I N G  C A R T -- displays our current Shopping Cart contents in an 'Accordion'
    let cartList = cart.map((item, index) =>
    {
        return (
            <>
                <MDBAccordionItem collapseId={index} headerTitle={item.name}>
                    <div onClick={() => deleteCartItem(index)}>
                        <strong>Price: ${item.cost}.00</strong> From: {item.country} <code>...click to REMOVE</code>
                    </div>
                </MDBAccordionItem>
            </>
        );
    });

    // R E C E I P T -- the running list for Checkout
    let finalList = () =>
    {
        let total = checkOut();
        let final = cart.map((item, index) =>
        {
            return (
                <div key={index} index={index}>
                    {item.name}
                </div>
            );
        });
        return {final, total};
    };

    // C H E C K O U T -- calculates total for Shoping Cart
    const checkOut = () =>
    {
        let costs = cart.map((item) => item.cost);
        const reducer = (accum, current) => accum + current;
        let newTotal = costs.reduce(reducer, 0);
        console.log(`total updated to ${newTotal}`);

        return newTotal;
    };

    // L E A V E -- takes the items out of the permanently, empties Shopping Cart
    const leaveStore = () =>
    {
        setCart([]);
        checkOut();
    };

    // R E S T O C K -- Connect to our StrapiDB API and get a fresh list of products
    const restockProducts = () =>
    {
        doFetch(query);

        let newItems = foodSupply.data.data.fruits.data.map((item) =>
        {
            let {name, country, cost, quantity} = item.attributes;

            for (let i = 0; i < products.length; i++)
            {

                if (name === products[i].name)
                {
                    var image = products[i].image;
                    break;
                }
            }

            return {name, country, cost, quantity, image};
        });

        setItems([...items, ...newItems]);
    };

    // T H E  C O M P O N E N T -- the entire User Interface
    return (
        <Container>
            <Row>
                <Col>
                    <h1>Product List</h1>
                    <ul style={{listStyleType: "none"}}>{list}</ul>
                </Col>
                <Col>
                    <h1>Shopping Cart</h1>
                    <MDBAccordion initialActive={0}>
                        {cartList}
                    </MDBAccordion>
                </Col>
                <Col>
                    <h1>CheckOut </h1>
                    <Button onClick={leaveStore}>CheckOut ${finalList().total}</Button>
                    <div> {finalList().total > 0 && finalList().final} </div>
                </Col>
            </Row>
            <Row>
                <form
                    onSubmit={(event) =>
                    {
                        restockProducts();
                        console.log(`Restock called on ${query}`);
                        event.preventDefault();
                    }}
                >
                    <input
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                    <br />
                    <button type="submit">ReStock Products</button>
                </form>
            </Row>
        </Container>
    );
}

// #region  P R I V A T E   F U N C T I O N S

/*
 * useDataApi() -- call a server for a data list.
 */
const useDataApi = (initialUrl, initialData) =>
{
    const {useState, useEffect, useReducer} = React;
    const [url, setUrl] = useState(initialUrl);

    const [state, dispatch] = useReducer(dataFetchReducer, {
        isLoading: false,
        isError: false,
        data: initialData,
    });

    console.log(`useDataApi called`);

    useEffect(() =>
    {
        console.log("useEffect Called");

        let didCancel = false;

        const fetchData = async () =>
        {
            dispatch({type: "FETCH_INIT"});
            try
            {
                const result = await Axios(url);

                console.log("FETCH FROM URL");

                if (!didCancel)
                {
                    dispatch({type: "FETCH_SUCCESS", payload: result.data});
                }
            }
            catch (error)
            {
                if (!didCancel)
                {
                    dispatch({type: "FETCH_FAILURE"});
                }
            }
        };
        fetchData();
        return () =>
        {
            didCancel = true;
        };
    }, [url]);

    return [state, setUrl];
};

/*
 * Helper for accessing remote server data.
 */
const dataFetchReducer = (state, action) =>
{
    switch (action.type)
    {
        case "FETCH_INIT":
            return {
                ...state,
                isLoading: true,
                isError: false,
            };

        case "FETCH_SUCCESS":
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };

        case "FETCH_FAILURE":
            return {
                ...state,
                isLoading: false,
                isError: true,
            };

        default:
            throw new Error();
    }
};

    // #endregion