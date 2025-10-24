export interface Device {
  id: string;
  name: string;
  brand: string;
  model: string;
  color: string;
  storage: string;
  price: number;
  image: string;
  category: string;
  sku: string;
  posSku?: string;
  bmc?: string;
  status?: string;
}

export const DEVICES: Device[] = [
  // Apple iPhone 16 Series
  { id: "iphone-16-128gb-black", name: "iPhone 16", brand: "Apple", model: "iPhone 16", color: "Black", storage: "128GB", price: 1099, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PH5BX", posSku: "112564", bmc: "18478514" },
  { id: "iphone-16-128gb-blue", name: "iPhone 16", brand: "Apple", model: "iPhone 16", color: "Blue", storage: "128GB", price: 1099, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PH5LX", posSku: "112576", bmc: "18478516" },
  { id: "iphone-16-128gb-pink", name: "iPhone 16", brand: "Apple", model: "iPhone 16", color: "Pink", storage: "128GB", price: 1099, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PH5PX", posSku: "112591", bmc: "18478518" },
  { id: "iphone-16-128gb-teal", name: "iPhone 16", brand: "Apple", model: "iPhone 16", color: "Teal", storage: "128GB", price: 1099, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PH5EX", posSku: "112603", bmc: "18478520" },
  { id: "iphone-16-128gb-white", name: "iPhone 16", brand: "Apple", model: "iPhone 16", color: "White", storage: "128GB", price: 1099, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PH5WX", posSku: "112615", bmc: "18478414" },
  { id: "iphone-16-256gb-black", name: "iPhone 16", brand: "Apple", model: "iPhone 16", color: "Black", storage: "256GB", price: 1249, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PH6BX", posSku: "112570", bmc: "18478515" },
  { id: "iphone-16-512gb-black", name: "iPhone 16", brand: "Apple", model: "iPhone 16", color: "Black", storage: "512GB", price: 1449, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PH7BX", posSku: "113384", bmc: "19334217", status: "Active" },
  
  // Apple iPhone 16 Pro
  { id: "iphone-16-pro-128gb-black", name: "iPhone 16 Pro", brand: "Apple", model: "iPhone 16 Pro", color: "Black", storage: "128GB", price: 1399, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PR5BX", posSku: "112381", bmc: "18478416" },
  { id: "iphone-16-pro-128gb-desert", name: "iPhone 16 Pro", brand: "Apple", model: "iPhone 16 Pro", color: "Desert", storage: "128GB", price: 1399, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PR5XX", posSku: "112405", bmc: "18478420" },
  { id: "iphone-16-pro-128gb-natural", name: "iPhone 16 Pro", brand: "Apple", model: "iPhone 16 Pro", color: "Natural", storage: "128GB", price: 1399, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PR58X", posSku: "112417", bmc: "18478422" },
  { id: "iphone-16-pro-256gb-black", name: "iPhone 16 Pro", brand: "Apple", model: "iPhone 16 Pro", color: "Black", storage: "256GB", price: 1549, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PR6BX", posSku: "112387", bmc: "18478417" },
  { id: "iphone-16-pro-512gb-black", name: "iPhone 16 Pro", brand: "Apple", model: "iPhone 16 Pro", color: "Black", storage: "512GB", price: 1699, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PR7BX", posSku: "112393", bmc: "18478418" },
  
  // Apple iPhone 16 Pro Max
  { id: "iphone-16-pro-max-256gb-black", name: "iPhone 16 Pro Max", brand: "Apple", model: "iPhone 16 Pro Max", color: "Black", storage: "256GB", price: 1649, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PM6BX", posSku: "112444", bmc: "18478426" },
  { id: "iphone-16-pro-max-256gb-desert", name: "iPhone 16 Pro Max", brand: "Apple", model: "iPhone 16 Pro Max", color: "Desert", storage: "256GB", price: 1649, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PM6XX", posSku: "112462", bmc: "18478429" },
  { id: "iphone-16-pro-max-512gb-black", name: "iPhone 16 Pro Max", brand: "Apple", model: "iPhone 16 Pro Max", color: "Black", storage: "512GB", price: 1849, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-max-model-unselect-gallery-1-202409?wid=470&hei=556&fmt=png-alpha&.v=1723234863988", category: "smartphone", sku: "X16PM7BX", posSku: "112450", bmc: "18478427" },
  
  // Apple iPhone 15 Series
  { id: "iphone-15-128gb-black", name: "iPhone 15", brand: "Apple", model: "iPhone 15", color: "Black", storage: "128GB", price: 949, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-black-select-202309?wid=470&hei=556&fmt=png-alpha&.v=1692895856458", category: "smartphone", sku: "X15PH5BX", posSku: "111113" },
  { id: "iphone-15-128gb-blue", name: "iPhone 15", brand: "Apple", model: "iPhone 15", color: "Blue", storage: "128GB", price: 949, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-blue-select-202309?wid=470&hei=556&fmt=png-alpha&.v=1692895856458", category: "smartphone", sku: "X15PH5LX", posSku: "111131", bmc: "17943365", status: "Active" },
  { id: "iphone-15-128gb-pink", name: "iPhone 15", brand: "Apple", model: "iPhone 15", color: "Pink", storage: "128GB", price: 949, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pink-select-202309?wid=470&hei=556&fmt=png-alpha&.v=1692895856458", category: "smartphone", sku: "X15PH5PX", posSku: "111160" },
  { id: "iphone-15-256gb-black", name: "iPhone 15", brand: "Apple", model: "iPhone 15", color: "Black", storage: "256GB", price: 1099, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-black-select-202309?wid=470&hei=556&fmt=png-alpha&.v=1692895856458", category: "smartphone", sku: "X15PH6BX", posSku: "111119", bmc: "17943373", status: "Active" },
  
  // Apple iPhone 15 Pro
  { id: "iphone-15-pro-128gb-natural", name: "iPhone 15 Pro", brand: "Apple", model: "iPhone 15 Pro", color: "Natural", storage: "128GB", price: 1299, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692895855329", category: "smartphone", sku: "X15PR58X", posSku: "111231", bmc: "17943369", status: "Active" },
  { id: "iphone-15-pro-max-256gb-natural", name: "iPhone 15 Pro Max", brand: "Apple", model: "iPhone 15 Pro Max", color: "Natural", storage: "256GB", price: 1549, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692895855329", category: "smartphone", sku: "X15PM68X", posSku: "111373", bmc: "17943366", status: "Active" },
  
  // Apple iPhone 14 & 13
  { id: "iphone-14-128gb-midnight", name: "iPhone 14", brand: "Apple", model: "iPhone 14", color: "Midnight", storage: "128GB", price: 849, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-midnight-select-2022?wid=470&hei=556&fmt=png-alpha&.v=1660780435012", category: "smartphone", sku: "X14PH52X", posSku: "109561", bmc: "17933279" },
  { id: "iphone-13-128gb-midnight", name: "iPhone 13", brand: "Apple", model: "iPhone 13", color: "Midnight", storage: "128GB", price: 749, image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-midnight-select-2021?wid=470&hei=556&fmt=png-alpha&.v=1645572315424", category: "smartphone", sku: "X130052X", posSku: "107517", bmc: "18196185", status: "Active" },
  
  // Samsung Galaxy S25
  { 
    id: "galaxy-s25-128gb-blue", 
    name: "Galaxy S25", 
    brand: "Samsung", 
    model: "Galaxy S25", 
    color: "Blue", 
    storage: "128GB", 
    price: 1099, 
    image: "https://images.samsung.com/ca/smartphones/galaxy-s25/images/galaxy-s25-features-design-spec.jpg?imbypass=true", 
    category: "smartphone", 
    sku: "XSPA15LX", 
    posSku: "112894", 
    bmc: "32423432", 
    status: "Active" 
  },
  
  // Samsung Galaxy S24
  { 
    id: "galaxy-s24-128gb-grey", 
    name: "Galaxy S24", 
    brand: "Samsung", 
    model: "Galaxy S24", 
    color: "Grey", 
    storage: "128GB", 
    price: 999, 
    image: "https://images.samsung.com/ca/smartphones/galaxy-s25/images/galaxy-s25-features-design-spec.jpg?imbypass=true", 
    category: "smartphone", 
    sku: "XSSE15IX", 
    posSku: "111626", 
    bmc: "17943306", 
    status: "Active" 
  },
  { 
    id: "galaxy-s24-ultra-256gb-grey", 
    name: "Galaxy S24 Ultra", 
    brand: "Samsung", 
    model: "Galaxy S24 Ultra", 
    color: "Grey", 
    storage: "256GB", 
    price: 1649, 
    image: "https://images.samsung.com/ca/smartphones/galaxy-s25/images/galaxy-s25-features-design-spec.jpg?imbypass=true", 
    category: "smartphone", 
    sku: "XSSE36IX", 
    posSku: "111736", 
    bmc: "17943312", 
    status: "Active" 
  },
  { 
    id: "galaxy-z-flip5-256gb-graphite", 
    name: "Galaxy Z Flip5", 
    brand: "Samsung", 
    model: "Galaxy Z Flip5", 
    color: "Graphite", 
    storage: "256GB", 
    price: 1299, 
    image: "https://images.samsung.com/ca/smartphones/galaxy-s25/images/galaxy-s25-features-design-spec.jpg?imbypass=true", 
    category: "smartphone", 
    sku: "XSZB56TX", 
    posSku: "110721", 
    bmc: "18904492", 
    status: "Active" 
  },
  
  // Google Pixel
  { 
    id: "pixel-10-128gb-black", 
    name: "Pixel 10", 
    brand: "Google", 
    model: "Pixel 10", 
    color: "Black", 
    storage: "128GB", 
    price: 899, 
    image: "https://www.bell.ca/Styles/images/Google-Pixel-10-XL/Google_Pixel_10_Pro_XL_Moonstone_Lrg1_EN.png", 
    category: "smartphone", 
    sku: "XPI105BX", 
    posSku: "113580", 
    bmc: "19429874", 
    status: "Active" 
  },
  { 
    id: "pixel-9-128gb-black", 
    name: "Pixel 9", 
    brand: "Google", 
    model: "Pixel 9", 
    color: "Black", 
    storage: "128GB", 
    price: 799, 
    image: "https://www.bell.ca/Styles/images/Google-Pixel-10-XL/Google_Pixel_10_Pro_XL_Moonstone_Lrg1_EN.png", 
    category: "smartphone", 
    sku: "XPIX95BX", 
    posSku: "112219", 
    bmc: "18245655", 
    status: "Active" 
  },
  { 
    id: "pixel-8-128gb-black", 
    name: "Pixel 8", 
    brand: "Google", 
    model: "Pixel 8", 
    color: "Black", 
    storage: "128GB", 
    price: 699, 
    image: "https://www.bell.ca/Styles/images/Google-Pixel-10-XL/Google_Pixel_10_Pro_XL_Moonstone_Lrg1_EN.png", 
    category: "smartphone", 
    sku: "XPIX85BX", 
    posSku: "110920", 
    bmc: "17943361", 
    status: "Active" 
  },
];
