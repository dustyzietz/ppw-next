"use client"
import Form from './Form';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import {useState} from 'react'


const api = new WooCommerceRestApi({
    url: "http://pricepointwholesale.com",
    consumerKey: process.env.NEXT_PUBLIC_CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    version: "wc/v3",
});

// async function getData() {
//   const res = await api.get("products", {
//     per_page: 20,
//     // fetch by category
//     category: 39,
//      // 20 products per page
// });
//   // The return value is *not* serialized
//   // You can return Date, Map, Set, etc.
//  //console.log(res.data)
   
 
//   return res.data
// }

async function getOrders() {
  const orders = await api.get("orders", {
    per_page: 20,
    // fetch by category
    category: 39,
     // 20 products per page
});
 //console.log(orders.data)
  return orders.data
}

export default function Admin() {
  const products = []
  const [orders, setOrders] = useState([])
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(()=>{
  const fetchOrders = async () => {
    const orders = await api.get("orders", {
        per_page: 20,
        // fetch by category
        category: 39,
         // 20 products per page
    });
     //console.log(orders.data)
      setOrders(orders.data) 
  }
  fetchOrders()
  },[])

    return (
        <main>
            {authenticated ? (
            <><h1>Authenticated</h1>
            {products.map(
                (product) => (
                    <div key={product.id}>
                        <h2>{product.name}</h2>
                        <p>{product.price}</p>
                        {product.images && product.images[0] && (
                            <img
                                src={product.images[0].src}
                                alt={product.name}
                            />
                        )}
                    </div>
                )
            )}
            {orders.map(
                (order) => (
                    <div key={order.id}>
                        <h2>{order.total}</h2>
                        
                    </div>
                )
            )}
            </>
    )
            :(<Form authenticated={authenticated} setAuthenticated={setAuthenticated} />)
            }
            
            
        </main>
    );
}


