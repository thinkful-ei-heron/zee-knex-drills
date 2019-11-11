require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

//drill 1: get all items that contain text
const searchTerm = 'O';

function searchAllItems(searchTerm) {
   
  knexInstance
    .select('view_id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}
searchAllItems('O');

//drill 2: get all items paginated
function paginateItems(pageNumber) {
  const itemsPerPage = 6;
  const offset = itemsPerPage * (pageNumber - 1);
  knexInstance  
    .select('view_id', 'name', 'price', 'date_added', 'checked', 'category')
    .from('shopping_list')
    .limit(itemsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result);
    });
}
paginateItems(1);

//drill 3: get all items added after date
function getItemsAddedDaysAgo(daysAgo) {
  knexInstance
    .select('view_id', 'name', 'price', 'date_added', 'checked', 'category')
    .where(
      'date_added',
      '>',
      // eslint-disable-next-line quotes
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .then(result => {
      console.log(result);
    });
}
getItemsAddedDaysAgo(30);

//drill 4: get total cost of categories
function getTotalCost() {
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .orderBy([
      {column: 'total', order: 'DESC' },
    ])
    .then(results => {
      console.log('Cost per category');
      console.log(results);
    })
    .catch(err => console.log(err))
    .finally(() => knexInstance.destroy());

}
getTotalCost();