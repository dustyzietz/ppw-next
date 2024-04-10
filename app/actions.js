'use server'
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
          url: "http://pricepointwholesale.com",
          consumerKey: process.env.NEXT_PUBLIC_CONSUMER_KEY,
          consumerSecret: process.env.CONSUMER_SECRET,
          version: "wc/v3",
      });
 
export async function fetchOrders() {
   const res = await api.get("orders", {
     per_page: 20,
     // fetch by category
     category: 39,
      // 20 products per page
 });
  return res.data
}

export async function fetchUsers(token) {
  // fetch users from Wordpress rest api
  const res = await fetch('https://pricepointwholesale.com/wp-json/wp/v2/users', {
    headers: {
        Authorization: `Bearer ${token}`
    }
  });
    const body = await res.json();
  return body
}