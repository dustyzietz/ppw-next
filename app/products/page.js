import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
    url: "http://pricepointwholesale.com",
    consumerKey: process.env.NEXT_PUBLIC_CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_SECRET,
    version: "wc/v3",
});

async function getData() {
    const res = await api.get("products", {
        per_page: 20,
        // fetch by category
        category: 39,
        // 20 products per page
    });
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   // console.log(res.data);

    return res.data;
}

export default async function Products() {
    const products = await getData();

    return (
        <main>
            <div className="container max-w-5xl w-full mx-auto text-center ">
                <h1 className="m-12">Custom Price Point Wholesale</h1>
                <a
                    className="text-xl block m-6 underline text-blue-600"
                    href="https://pricepointwholesale.com/shop"
                >
                    {" "}
                    All Products{" "}
                </a>
                <a
                    className="text-xl block m-6 underline text-blue-600"
                    href="/account"
                >
                    Custom Orders
                </a>
                <a
                    className="text-xl block m-6 underline text-blue-600"
                    href="/products"
                >
                    Resellers Products
                </a>
            </div>
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
        </main>
    );
}
