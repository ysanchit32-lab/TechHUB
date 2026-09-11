const products = [
  {
    id: 1,
    name: "Dell Inspiron 15",
    category: "Office Laptop",
    brand: "Dell",
    price: 55000,
    stock: 12,
    rating: 4.4,
    image:
      "https://pctech.co.in/image/cache/catalog/Laptops/DELL/inspiron-3530/dell-inspiron-15-3530-laptop-04-800x800w.png",
    description:
      "Reliable laptop for office and everyday productivity.",
    features: [
      "Intel Core i5",
      "8GB RAM",
      "512GB SSD",
      "15.6-inch Display",
    ],
  },

  {
    id: 2,
    name: "HP Pavilion 14",
    category: "Office Laptop",
    brand: "HP",
    price: 62000,
    stock: 8,
    rating: 4.5,
    image:
      "https://gogsystem.com/wp-content/uploads/2022/12/8W382LAABM.webp",
    description:
      "Compact and powerful laptop for professional work.",
    features: [
      "Intel Core i5",
      "16GB RAM",
      "512GB SSD",
      "14-inch Display",
    ],
  },

  {
    id: 3,
    name: "Lenovo ThinkPad E14",
    category: "Office Laptop",
    brand: "Lenovo",
    price: 68000,
    stock: 5,
    rating: 4.7,
    image:
      "https://p2-ofp.static.pub//fes/cms/2024/04/01/ftl62xwvpojikibk3nc99l3i1epvkk200820.png",
    description:
      "Business laptop designed for productivity and durability.",
    features: [
      "Intel Core i7",
      "16GB RAM",
      "512GB SSD",
      "14-inch Display",
    ],
  },

  {
    id: 4,
    name: "ASUS ROG Strix G16",
    category: "Gaming Laptop",
    brand: "ASUS",
    price: 125000,
    stock: 6,
    rating: 4.8,
    image:
      "https://dlcdnwebimgs.asus.com/gain/E20134EE-F6B3-4AB7-A1B5-73795E91011D/w1000/h732",
    description:
      "High-performance gaming laptop built for demanding games.",
    features: [
      "Intel Core i7",
      "16GB RAM",
      "1TB SSD",
      "RTX Graphics",
    ],
  },

  {
    id: 5,
    name: "Acer Nitro V",
    category: "Gaming Laptop",
    brand: "Acer",
    price: 85000,
    stock: 9,
    rating: 4.5,
    image:
      "https://cdn.nguyenkimmall.com/images/detailed/1119/10057033-laptop-acer-gaming-nitro-anv15-51-55ca-i5-13420h-nh-qn8sv-004-1.jpg",
    description:
      "Affordable gaming laptop with excellent performance.",
    features: [
      "Intel Core i5",
      "16GB RAM",
      "512GB SSD",
      "RTX Graphics",
    ],
  },

  {
    id: 6,
    name: "MSI Katana 15",
    category: "Gaming Laptop",
    brand: "MSI",
    price: 105000,
    stock: 4,
    rating: 4.6,
    image:
      "https://store974.com/cdn/shop/products/NewProject-2023-03-02T091213.429-964739.jpg?crop=center&height=1000&v=1677778744&width=1000",
    description:
      "Gaming-focused laptop with powerful hardware.",
    features: [
      "Intel Core i7",
      "16GB RAM",
      "1TB SSD",
      "RTX 4060",
    ],
  },

  {
    id: 7,
    name: "Dell OptiPlex 7010",
    category: "PC",
    brand: "Dell",
    price: 58000,
    stock: 10,
    rating: 4.4,
    image:
      "https://m.media-amazon.com/images/I/71zWa+rV1OL._AC_SL1500_.jpg",
    description:
      "Professional desktop computer for office environments.",
    features: [
      "Intel Core i5",
      "16GB RAM",
      "512GB SSD",
      "Windows 11",
    ],
  },

  {
    id: 8,
    name: "HP ProDesk 400",
    category: "PC",
    brand: "HP",
    price: 52000,
    stock: 7,
    rating: 4.3,
    image:
      "https://m.media-amazon.com/images/I/61lAOueIdUL._AC_SL1500_.jpg",
    description:
      "Compact desktop designed for everyday business tasks.",
    features: [
      "Intel Core i5",
      "8GB RAM",
      "512GB SSD",
      "Windows 11",
    ],
  },

  {
    id: 9,
    name: "Lenovo ThinkCentre M70",
    category: "PC",
    brand: "Lenovo",
    price: 61000,
    stock: 3,
    rating: 4.5,
    image:
      "https://p2-ofp.static.pub//fes/cms/2024/04/29/wp6n5muf8l50ez5n1ytzgsd67bvkdz787637.png",
    description:
      "Reliable business desktop with efficient performance.",
    features: [
      "Intel Core i5",
      "16GB RAM",
      "512GB SSD",
      "Windows 11",
    ],
  },

  {
    id: 10,
    name: "TechHUB Creator PC",
    category: "Custom PC",
    brand: "TechHUB",
    price: 145000,
    stock: 4,
    rating: 4.9,
    image:
      "https://m.media-amazon.com/images/I/71cWaEV9jDL._AC_SL1500_.jpg",
    description:
      "Custom-built PC for creators and professionals.",
    features: [
      "Ryzen 7",
      "32GB RAM",
      "1TB SSD",
      "RTX 4070",
    ],
  },

  {
    id: 11,
    name: "TechHUB Gaming Beast",
    category: "Custom PC",
    brand: "TechHUB",
    price: 185000,
    stock: 2,
    rating: 4.9,
    image:
      "https://m.media-amazon.com/images/I/81LY148PCvL._AC_SL1500_.jpg",
    description:
      "Extreme-performance custom gaming PC.",
    features: [
      "Ryzen 9",
      "32GB RAM",
      "2TB SSD",
      "RTX 4080",
    ],
  },

  {
    id: 12,
    name: "TechHUB Starter PC",
    category: "Custom PC",
    brand: "TechHUB",
    price: 75000,
    stock: 6,
    rating: 4.6,
    image:
      "https://m.media-amazon.com/images/I/71-AA5sXrNL._AC_SL1500_.jpg",
    description:
      "Balanced custom PC for everyday users and students.",
    features: [
      "Ryzen 5",
      "16GB RAM",
      "512GB SSD",
      "Integrated Graphics",
    ],
  },

  {
    id: 13,
    name: "Corsair 16GB DDR5 RAM",
    category: "Components",
    brand: "Corsair",
    price: 6500,
    stock: 15,
    rating: 4.8,
    image:
      "https://git.gestionresellers.com.ar/public_image_server/37286/1770208561",
    description:
      "High-speed DDR5 memory for modern computers.",
    features: [
      "16GB Capacity",
      "DDR5",
      "5600MHz",
      "Desktop RAM",
    ],
  },

  {
    id: 14,
    name: "Samsung 1TB NVMe SSD",
    category: "Components",
    brand: "Samsung",
    price: 8500,
    stock: 11,
    rating: 4.9,
   image:
  "https://multimedia.bbycastatic.ca/multimedia/products/500x500/166/16624/16624802.jpg",
    description:
      "Fast NVMe storage for improved system performance.",
    features: [
      "1TB Capacity",
      "NVMe",
      "PCIe 4.0",
      "High Speed",
    ],
  },

  {
    id: 15,
    name: "NVIDIA RTX 4060",
    category: "Components",
    brand: "NVIDIA",
    price: 32000,
    stock: 5,
    rating: 4.8,
    image:
      "https://m.media-amazon.com/images/I/71kVEw7kuPL._AC_SL1500_.jpg",
    description:
      "Powerful graphics card for gaming and creative workloads.",
    features: [
      "8GB VRAM",
      "Ray Tracing",
      "DLSS",
      "PCIe 4.0",
    ],
  },

  {
    id: 16,
    name: "Logitech MX Master 3S",
    category: "Accessories",
    brand: "Logitech",
    price: 8500,
    stock: 14,
    rating: 4.8,
    image:
      "https://resource.logitech.com/w_692%2Cc_lpad%2Car_4%3A3%2Cq_auto%2Cf_auto%2Cdpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s-business-wireless-mouse/gallery/mx-master-3s-for-business-gallery-1.png?v=1",
    description:
      "Premium wireless mouse for productivity.",
    features: [
      "Wireless",
      "Bluetooth",
      "Ergonomic",
      "Rechargeable",
    ],
  },

  {
    id: 17,
    name: "Mechanical RGB Keyboard",
    category: "Accessories",
    brand: "Redragon",
    price: 4500,
    stock: 3,
    rating: 4.6,
    image:
      "https://redragonshop.com/cdn/shop/files/Redragon_keyboard-colleciton.png?v=1711505044",
    description:
      "Mechanical keyboard with RGB lighting.",
    features: [
      "Mechanical Switches",
      "RGB",
      "USB",
      "Anti-Ghosting",
    ],
  },

  {
    id: 18,
    name: "Gaming Headset",
    category: "Accessories",
    brand: "HyperX",
    price: 6500,
    stock: 0,
    rating: 4.7,
    image:
      "https://cdn.idealo.com/folder/Product/4773/1/4773176/s1_produktbild_max/hyperx-cloud-ii-gun-metal.jpg",
    description:
      "Gaming headset with immersive sound and microphone.",
    features: [
      "7.1 Surround",
      "Noise Cancellation",
      "Mic",
      "USB",
    ],
  },
];

export default products;