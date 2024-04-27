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
 });
  return res.data
}

export async function fetchProducts() {
  const res = await api.get("products", {
    per_page: 20,
     // 20 products per page
});
 return res.data
}

export async function fetchCustomProducts() {
  const res = await api.get("products", {
    per_page: 20,
     // 20 products per page
     category: process.env.CUSTOM_CATEGORY,
     // 20 products per page
});
 return res.data
}

export async function fetchOrdersForCurrentUser(id) {
  // get current logged in user id
  const res = await api.get("orders", {
    per_page: 20,
    // fetch by customer
    customer: id,
});
  const customRes = await api.get("orders", {
    per_page: 20,
    // fetch by customer
    customer: id,
    category: 40,
});
 return {orders: res.data, customOrders: customRes.data}
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

// export async function fetchCurrentUser(token) {
//   // fetch users from Wordpress rest api
//   const res = await fetch('https://pricepointwholesale.com/wp-json/wp/v2/users/me', {
//     headers: {
//         Authorization: `Bearer ${token}`
//     }
//   });
//     const body = await res.json();
//   return {id: body.id, name: body.name, is_super_admin: body.is_super_admin}
// }

export async function createDesign(token, design) {
  
  const res = await fetch('https://pricepointwholesale.com/wp-json/custom/v1/add-design', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(design)
  });
  const body = await res.json();
  return body
}

export async function fetchCurrentUser(token) {
  // fetch users from Wordpress rest api
  try {
    const res = await fetch('https://pricepointwholesale.com/wp-json/custom/v1/current-user', {
    headers: {
        Authorization: `Bearer ${token}`
    }
  });
    const body = await res.json();
  return body
  } catch (error) {
    console.log(error)
    return {error: error.message}
  }
}

export async function fetchDesigns(token) {
  try {
    const res = await fetch('https://pricepointwholesale.com/wp-json/custom/v1/user-designs', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
    const body = await res.json();
  return body
} catch (error) {
  throw new Error(`This is error is in the Server Action`);
}  
}

export async function fetchProductDesigns(token) {
  try {
    const res = await fetch('https://pricepointwholesale.com/wp-json/custom/v1/product-designs', {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
    const body = await res.json();
  return body
} catch (error) {
  throw new Error(`This is error is in the Server Action`);
}  
}

export async function linkDesign(token, data) {
  const res = await fetch('https://pricepointwholesale.com/wp-json/custom/v1/product-designs', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const body = await res.json();
  return body
}

export async function addTemplate(token, data) {
  const res = await fetch('https://pricepointwholesale.com/wp-json/custom/v1/add-template', {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const body = await res.json();
  return body
}

export async function fetchTemplates(token) {
  // fetch users from Wordpress rest api
  const res = await fetch('https://pricepointwholesale.com/wp-json/custom/v1/fetch-templates', {
    headers: {
        Authorization: `Bearer ${token}`
    }
  });
    const body = await res.json();
  return body
}

export async function updateTemplate(token, data) {
  const res = await fetch(`https://pricepointwholesale.com/wp-json/custom/v1/update-template/${data.template_id}`, {
    method: 'POST',
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({template: data.template, product_id: data.product_id})
  });
  const body = await res.json();
  return body
}

const AWS = require('aws-sdk')
AWS.config.update({ 
  region: process.env.REGION,
  accessKeyId: process.env.AMAZON_ACCESS_KEY,
  secretAccessKey: process.env.AMAZON_SECRET_KEY,
 })
const s3 = new AWS.S3({
  region: "us-west-1",
  accessKeyId: process.env.AMAZON_ACCESS_KEY,
  secretAccessKey: process.env.AMAZON_SECRET_KEY,
  signatureVersion: "v4",
});
const uploadBucket = process.env.BUCKET   // << LOOK!
 let extension = "";
 let type = "";

 // Change to regular function
 export async function getPresignedUrl(type) {

 if(type === 'audio/wav'){
   extension = 'wav';
 } else if (type === 'image/jpeg'){
   extension = 'jpg';
 }else if (type === 'image/png'){
   extension = 'png';
 }
  const result = await getUploadURL();
  const data = JSON.parse(result.body);
  return data;
};

const getUploadURL = async function() {
  let actionId = Date.now()

  var s3Params = {
    Bucket: uploadBucket,
    Key:  `${actionId}.${extension}`,
    ContentType: type,
//    CacheControl: 'max-age=31104000',
    ACL: 'public-read',   // Optional if you want the object to be publicly readable
  };

  return new Promise((resolve, reject) => {
    // Get signed URL
    let uploadURL = s3.getSignedUrl('putObject', s3Params)
    resolve({
      "statusCode": 200,
      "isBase64Encoded": false,
      "headers": {
        "Access-Control-Allow-Origin": "*"
      },
      "body": JSON.stringify({
          "uploadURL": uploadURL,
          "photoFilename": `${actionId}.${extension}`
      })
    })
  })
}
