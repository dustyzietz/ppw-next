
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
    url: "http://pricepointwholesale.com",
    consumerKey: process.env.NEXT_PUBLIC_CONSUMER_KEY,
    consumerSecret: process.env.NEXT_PUBLIC_CONSUMER_SECRET,
    version: "wc/v3",
});
// Do JWT login and search for orders by that customer
async function getOrders() {
    const orders = await api.get("orders", {
        per_page: 20,
        // fetch for customer 1
        customer: 1,
      
    });
    console.log(orders.data)
    return orders.data;
}

export default async function Products() {
    const orders = await getOrders();

    return (
        <main>
            {orders.map((order) => (
                <div key={order.id}>
                    <h2>{order.total}</h2>
                    {console.log(order._links)}
                </div>
            ))}
        </main>
    );
}
