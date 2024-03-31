// create server side arrow function
// Fetch props from /wp/v2/menus

import Link from "next/link";

const Header = () => {
  return (
    <header >
      <div className="h-20 bg-black w-full text-white">
         <div className="container mx-auto flex max-w-7xl items-center h-20">
          <h1 className="flex-grow text-3xl"><a href="https://pricepointwholesale.com">Price Point Wholesale</a></h1>
          <nav>
            <ul className="flex">
              <li className="px-2"><a>All Products</a></li>
              <li className="px-2"><Link href="/custom-form">Custom Product Form</Link></li>
              <li className="px-2"><Link href="/reseller-application">Reseller Application</Link></li>
            {/* <li className="px-2">My Custom Orders</li> */}
            </ul>
          </nav>
          
         </div>
      </div>
    </header>
  );
}

export default Header;