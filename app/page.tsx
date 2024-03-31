import Image from "next/image";

export default function Home() {
  return (
    <main >
    <div className="container max-w-5xl w-full mx-auto text-center ">
     <h1 className="m-12">Custom Price Point Wholesale</h1>
      <a className="text-xl block m-6 underline text-blue-600" href="https://pricepointwholesale.com/shop"> All Products </a>
      <a className="text-xl block m-6 underline text-blue-600"  href="/account"> Custom Orders </a>
      <a className="text-xl block m-6 underline text-blue-600"  href="/products"> Resellers Products</a>
    </div>
  </main>
  );
}
