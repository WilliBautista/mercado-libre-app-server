// Base imports.
const express = require('express');
const axios = require("axios");
const baseUrl = process.env.MERCADO_LIBRE_API_URL || 'https://api.mercadolibre.com';

// Initialization.
const app = express();

// Get items by search query
app.get('/items', (req, res) => {
  const { q } = req.query;
  searchItems(q)
    .then(data => res.status(200).json(data));
});

/**
 * Search items.
 * @param {string} query word or phrase to get items.
 * @returns Collection of items
 */
const searchItems = (query) => {
  return axios.get(`${baseUrl}/sites/MLA/search?q=${query}&limit=4`)
    .then(({ data }) => {
      const { results, filters } = data;
      let items = [];
      let breadcrumb = [];

      // Organize items
      results.forEach((item) => {
        const {
          id,
          title,
          currency_id: currency,
          price: amount,
          thumbnail,
          thumbnail_id,
          condition,
          shipping,
          address,
        } = item;

        items.push({
          id,
          title,
          price: {
            currency,
            amount,
          },
          thumbnail,
          thumbnail_id,
          condition,
          free_shipping: shipping.free_shipping,
          state_name: address.state_name,
        });
      });

      // Filter categories
      if (!!filters) {
        const categories = filters.find(filter => filter.id === "category");
        breadcrumb = !!categories ? categories.values[0].path_from_root : [];
      }

      return {
        author: {
          name: "William Steven",
          lastname: "Bautista Gutierrez",
        },
        categories: breadcrumb,
        items,
      };
    });
}

// Get items by id with description
app.get('/items/:id', (req, res) => {
  const id = req.params.id;
  getItemById(id)
    .then(data => res.status(200).json(data))
    .catch(data => res.status(404).json(data));
});

/**
 * Get item by id
 * @param {string} id item id
 * @returns object with item data
 */
const getItemById = (id) => {
  return new Promise((resolve, reject) => {
    axios.get(`${baseUrl}/items/${id}`)
      .then(async ({ data }) => {
        const description = await axios.get(`${baseUrl}/items/${data.id}/description`)
          .then(({ data }) => data.plain_text)
          .catch(() => null);

        const {
          id,
          title,
          currency_id: currency,
          price: amount,
          pictures,
          condition,
          shipping,
          sold_quantity,
          permalink,
        } = data;

        resolve({
          author: {
            name: "William Steven",
            lastname: "Bautista Gutierrez",
          },
          item: {
            id,
            title,
            price: {
              currency,
              amount,
            },
            pictures,
            condition,
            free_shipping: shipping.free_shipping,
            sold_quantity,
            description,
            permalink,
          },
        });
      })
      .catch(({ response }) => reject(response.data));
  });
}

module.exports = app;
