"use client";
import Button from "@/components/Button";
import List from "@/components/List";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";

export default function Home() {
    return (
        <main>
          <Hero textOverlay={true} text=" Create Your Own Unique Products with Price Point Wholesale" image="/stock-packaging-home.jpeg" />
            <section className="container max-w-5xl w-full mx-auto text-center ">
                <h2 className="m-6 mt-12 text-2xl">
                    Unleash Your Creativity with Custom Designs!
                </h2>

                <p>
                    At Price Point Wholesale, we believe in the power of
                    individuality. That's why we offer you the opportunity to
                    bring your unique vision to life with our custom design
                    feature. Whether you're a business looking to stand out with
                    branded merchandise or an individual wanting to express your
                    personality through custom products, our platform empowers
                    you to create something truly one-of-a-kind.
                </p>
                <div className="text-center my-6 w-full">
                    <Link href="/designs">
                        <Button text="Create Your Design Now" />
                    </Link>
                </div>
                <List
                    listHeader="Custom Design Process:"
                    numbered
                    listItems={[
                        {
                            header: "Design Creation:",
                            body: "Use our intuitive design tool to bring your ideas to life. Upload your own artwork or choose from our library of graphics, fonts, and templates to craft a design that reflects your style.",
                        },
                        {
                            header: "Preview & Customize:",
                            body: "Visualize your design in real-time with our preview feature. Make adjustments until you're completely satisfied with every detail.",
                        },
                        {
                            header: "Submit Your Design:",
                            body: "Once you're happy with your creation, simply submit your design to us for production. Our team will review it to ensure it meets our quality standards.",
                        },
                        {
                            header: "Production & Delivery:",
                            body: "Sit back and relax as we handle the production process. Your custom-designed products will be expertly crafted and delivered to your doorstep in no time.",
                        },
                    ]}
                />
                <List
                    listHeader="Why Choose Custom Designs with Price Point Wholesale?"
                    listItems={[
                        {
                            header: "Endless Possibilities:",
                            body: "From apparel and accessories to promotional items and gifts, our custom design feature allows you to personalize a wide range of products to suit your needs.",
                        },
                        {
                            header: "Quality Assurance:",
                            body: "We use high-quality materials and advanced printing techniques to ensure that your custom-designed products look and feel amazing.",
                        },
                        {
                            header: "Fast Turnaround:",
                            body: "With efficient production processes and reliable shipping options, you'll receive your custom creations promptly, ready to impress.",
                        },
                    ]}
                />
            </section>
            <section className="container max-w-5xl w-full mx-auto text-center ">
                <h2 className="m-6 mt-12 text-2xl">
                Unlock Exclusive Benefits as a Price Point Wholesale Reseller!
                </h2>

                <p>
                    Are you ready to take your business to the next level?
                    Become a Price Point Wholesale reseller and enjoy a host of
                    exclusive benefits tailored to support your growth and
                    success.
                </p>
                <List
                    listHeader="Why Become a Reseller?"
                    listItems={[
                        {
                            header: "Better Prices:",
                            body: "As a Price Point Wholesale reseller, you'll gain access to special pricing and discounts, allowing you to maximize your profit margins and stay competitive in the market.",
                        },
                        {
                            header: "Tax Exemption:",
                            body: "Say goodbye to sales tax headaches! Resellers are eligible for tax exemption on qualifying purchases, helping you save money and streamline your operations.",
                        },
                        {
                            header: "Priority Support:",
                            body: "Receive dedicated support from our team of experts, ensuring that your needs are met promptly and efficiently.",
                        },
                        {
                            header: "Exclusive Offers:",
                            body: "Be the first to know about new product launches, promotions, and special offers available only to our valued reseller partners.",
                        },
                    ]}
                />
                <div className="text-center my-6 w-full">
                    <Link href="/reseller-application">
                        <Button text="Apply Now" />
                    </Link>
                </div>
            </section>

            <section className="container max-w-5xl w-full mx-auto text-center ">
              <List listHeader="How It Works:" numbered listItems={[
                {
                  header: "Fill Out the Application:",
                  body: "Complete our easy-to-use online application form. Provide us with some basic information about your business and why you're interested in becoming a Price Point Wholesale reseller.",
                },
                {
                  header: "Review & Approval:",
                  body: "Once we receive your application, our team will review it to ensure that you meet our reseller requirements. We'll notify you of your application status within [insert timeframe].",
                },
              ]} />
                
            </section>
            <section className="container max-w-5xl w-full mx-auto text-center ">
                <h2 className="m-6 mt-12 text-2xl">
                  
            Stay Organized and Informed</h2>
<p>Welcome to your personalized hub for managing your custom orders and Reseller Application status. Keep track of your designs, monitor the progress of your orders, and stay updated on your Reseller Application all in one convenient location.</p>

 <div className="my-8 text-center" ><Link href="/account#orders" ><Button text="View Orders" /></Link></div> 

  <div className="my-8 text-center" ><Link  href="/account#application"><Button text="Application Status" /></Link></div>


<List
listItems={[
  {
    header: "View Custom Orders:",
    body: "Click the 'View Orders' button to access a dashboard where you can see all your custom orders. From there, you can track the status of each order and manage the designs associated with them.",
  },
  {
    header: "Check Application Status:",
    body: "Click the 'Check Application Status' button to view the current status of your Reseller Application. Whether it's 'Pending Review,' 'Approved,' or 'Declined,' you'll have instant visibility into your application progress.",
  },
]} />
            </section>
            <section className="container max-w-5xl w-full mx-auto text-center ">
                <h2 className="m-6 mt-12 text-2xl">
                    Need Assistance?
                </h2>

                <p>
                    If you have any questions or need assistance with your custom
                    orders or Reseller Application, our dedicated support team is
                    here to help. Reach out to us at [insert contact details] for
                    prompt assistance.
                </p>
            </section>
        </main>
    );
}

