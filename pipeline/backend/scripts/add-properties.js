import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE_URL = process.env.API_URL || 'http://localhost:3001';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Properties to add - focusing on the new categories
const propertiesToAdd = [
  // Commercial Properties
  {
    title: "Prime Commercial Space in Yelahanka",
    type: "commercial",
    city: "Bengaluru",
    area: "Yelahanka",
    priceLabel: "₹2 50–80 L",
    size: "2000–5000 sq ft",
    status: "available",
    highlights: ["Prime location", "High footfall", "Parking available", "Ready to move"],
    lat: 13.1050,
    lon: 77.5950,
    images: [
      "https://picsum.photos/seed/com-yela-001-1/800/600",
      "https://picsum.photos/seed/com-yela-001-2/800/600",
      "https://picsum.photos/seed/com-yela-001-3/800/600"
    ],
    description: "Premium commercial space in the heart of Yelahanka, perfect for offices, showrooms, or retail businesses. Located on a main road with excellent visibility and high footfall. The property offers modern amenities, ample parking, and is ready for immediate occupation."
  },
  {
    title: "Modern Commercial Complex in Kattigenahalli",
    type: "commercial",
    city: "Bengaluru",
    area: "Kattigenahalli",
    priceLabel: "₹3 20–60 L",
    size: "3000–8000 sq ft",
    status: "new",
    highlights: ["Modern design", "Multiple floors", "Elevator access", "Power backup"],
    lat: 13.2100,
    lon: 77.5900,
    images: [
      "https://picsum.photos/seed/com-katt-002-1/800/600",
      "https://picsum.photos/seed/com-katt-002-2/800/600",
      "https://picsum.photos/seed/com-katt-002-3/800/600"
    ],
    description: "State-of-the-art commercial complex featuring modern architecture and premium amenities. Ideal for corporate offices, co-working spaces, or professional services. The building offers flexible floor plans, 24/7 security, and is located in a rapidly developing commercial hub."
  },
  {
    title: "Strategic Commercial Property in Hunasamaranahalli",
    type: "commercial",
    city: "Bengaluru",
    area: "Hunasamaranahalli",
    priceLabel: "₹1 80–45 L",
    size: "1500–4000 sq ft",
    status: "available",
    highlights: ["Strategic location", "Near IT hub", "Good connectivity", "Investment potential"],
    lat: 13.3450,
    lon: 77.5700,
    images: [
      "https://picsum.photos/seed/com-huna-003-1/800/600",
      "https://picsum.photos/seed/com-huna-003-2/800/600",
      "https://picsum.photos/seed/com-huna-003-3/800/600"
    ],
    description: "Strategically located commercial property in the emerging business district of Hunasamaranahalli. Perfect for businesses looking to establish a presence in a growing market. The location offers excellent connectivity to major IT corridors and residential areas."
  },
  // Retail Properties
  {
    title: "Prime Retail Space in Yelahanka",
    type: "retail",
    city: "Bengaluru",
    area: "Yelahanka",
    priceLabel: "₹1 50–35 L",
    size: "800–2000 sq ft",
    status: "available",
    highlights: ["High street location", "Ground floor", "High visibility", "Parking available"],
    lat: 13.1080,
    lon: 77.5920,
    images: [
      "https://picsum.photos/seed/ret-yela-001-1/800/600",
      "https://picsum.photos/seed/ret-yela-001-2/800/600",
      "https://picsum.photos/seed/ret-yela-001-3/800/600"
    ],
    description: "Premium retail space on a high-traffic street in Yelahanka. Perfect for fashion stores, electronics, restaurants, or service businesses. The ground floor location offers excellent visibility and easy access for customers. Ample parking space available."
  },
  {
    title: "Modern Retail Outlet in Kattigenahalli",
    type: "retail",
    city: "Bengaluru",
    area: "Kattigenahalli",
    priceLabel: "₹2 20–50 L",
    size: "1200–3000 sq ft",
    status: "new",
    highlights: ["Modern design", "Shopping complex", "Multiple brands", "Food court nearby"],
    lat: 13.2080,
    lon: 77.5850,
    images: [
      "https://picsum.photos/seed/ret-katt-002-1/800/600",
      "https://picsum.photos/seed/ret-katt-002-2/800/600",
      "https://picsum.photos/seed/ret-katt-002-3/800/600"
    ],
    description: "Contemporary retail outlet space in a modern shopping complex. Ideal for branded stores, specialty shops, or service centers. The complex features multiple retail units, shared parking, and is located near residential communities for consistent footfall."
  },
  {
    title: "Affordable Retail Shop in Chikkaballapur",
    type: "retail",
    city: "Bengaluru",
    area: "Chikkaballapur",
    priceLabel: "₹1 15–30 L",
    size: "600–1500 sq ft",
    status: "available",
    highlights: ["Affordable", "Main road", "Growing area", "Good ROI"],
    lat: 13.4350,
    lon: 77.7150,
    images: [
      "https://picsum.photos/seed/ret-chik-003-1/800/600",
      "https://picsum.photos/seed/ret-chik-003-2/800/600",
      "https://picsum.photos/seed/ret-chik-003-3/800/600"
    ],
    description: "Affordable retail shop space in the developing commercial area of Chikkaballapur. Perfect for small businesses, local retailers, or entrepreneurs starting their retail venture. The location offers good growth potential and reasonable rental yields."
  },
  // Hospitality Properties
  {
    title: "Luxury Hotel Property in Yelahanka",
    type: "hospitality",
    city: "Bengaluru",
    area: "Yelahanka",
    priceLabel: "₹5 00–120 Cr",
    size: "50000–100000 sq ft",
    status: "available",
    highlights: ["Prime location", "Airport proximity", "Tourist area", "Development ready"],
    lat: 13.1020,
    lon: 77.6000,
    images: [
      "https://picsum.photos/seed/hos-yela-001-1/800/600",
      "https://picsum.photos/seed/hos-yela-001-2/800/600",
      "https://picsum.photos/seed/hos-yela-001-3/800/600"
    ],
    description: "Premium hospitality property ideal for developing a luxury hotel or resort. Located near the airport and major tourist attractions, this property offers excellent potential for hospitality ventures. The land is development-ready with all necessary approvals."
  },
  {
    title: "Restaurant Commercial Space in Kattigenahalli",
    type: "hospitality",
    city: "Bengaluru",
    area: "Kattigenahalli",
    priceLabel: "₹2 80–60 L",
    size: "2000–5000 sq ft",
    status: "new",
    highlights: ["Restaurant ready", "Kitchen setup", "Parking space", "High footfall area"],
    lat: 13.2120,
    lon: 77.5880,
    images: [
      "https://picsum.photos/seed/hos-katt-002-1/800/600",
      "https://picsum.photos/seed/hos-katt-002-2/800/600",
      "https://picsum.photos/seed/hos-katt-002-3/800/600"
    ],
    description: "Perfect space for restaurant or cafe business in a high-traffic commercial area. The property comes with basic kitchen infrastructure and is ready for restaurant fit-out. Located in a food hub with excellent visibility and customer accessibility."
  },
  {
    title: "Boutique Hotel Opportunity in Hunasamaranahalli",
    type: "hospitality",
    city: "Bengaluru",
    area: "Hunasamaranahalli",
    priceLabel: "₹3 50–90 Cr",
    size: "30000–70000 sq ft",
    status: "available",
    highlights: ["Scenic location", "Boutique potential", "Tourism growth", "Approved plans"],
    lat: 13.3420,
    lon: 77.5750,
    images: [
      "https://picsum.photos/seed/hos-huna-003-1/800/600",
      "https://picsum.photos/seed/hos-huna-003-2/800/600",
      "https://picsum.photos/seed/hos-huna-003-3/800/600"
    ],
    description: "Unique opportunity to develop a boutique hotel or resort in a scenic location. The property offers natural beauty, privacy, and excellent potential for luxury hospitality ventures. With growing tourism in the region, this represents a strong investment opportunity."
  },
  // Industrial Properties
  {
    title: "Warehouse & Industrial Space in Yelahanka",
    type: "industrial",
    city: "Bengaluru",
    area: "Yelahanka",
    priceLabel: "₹2 50–80 L",
    size: "10000–25000 sq ft",
    status: "available",
    highlights: ["Warehouse ready", "Loading dock", "High ceiling", "Logistics hub"],
    lat: 13.1150,
    lon: 77.6100,
    images: [
      "https://picsum.photos/seed/ind-yela-001-1/800/600",
      "https://picsum.photos/seed/ind-yela-001-2/800/600",
      "https://picsum.photos/seed/ind-yela-001-3/800/600"
    ],
    description: "Spacious warehouse and industrial facility perfect for storage, manufacturing, or logistics operations. Features high ceilings, loading docks, and excellent connectivity to major highways. Located in an established industrial zone with all necessary infrastructure."
  },
  {
    title: "Manufacturing Unit in Kattigenahalli",
    type: "industrial",
    city: "Bengaluru",
    area: "Kattigenahalli",
    priceLabel: "₹3 20–70 L",
    size: "15000–35000 sq ft",
    status: "new",
    highlights: ["Manufacturing ready", "Power supply", "Water connection", "Industrial zone"],
    lat: 13.2180,
    lon: 77.6050,
    images: [
      "https://picsum.photos/seed/ind-katt-002-1/800/600",
      "https://picsum.photos/seed/ind-katt-002-2/800/600",
      "https://picsum.photos/seed/ind-katt-002-3/800/600"
    ],
    description: "Modern manufacturing facility in a designated industrial zone. Ideal for light to medium manufacturing, assembly operations, or industrial services. The property includes dedicated power supply, water connections, and complies with all industrial regulations."
  },
  {
    title: "Logistics Park in Chikkaballapur",
    type: "industrial",
    city: "Bengaluru",
    area: "Chikkaballapur",
    priceLabel: "₹4 00–100 L",
    size: "20000–50000 sq ft",
    status: "available",
    highlights: ["Logistics hub", "Highway access", "Multiple units", "Distribution center"],
    lat: 13.4450,
    lon: 77.7400,
    images: [
      "https://picsum.photos/seed/ind-chik-003-1/800/600",
      "https://picsum.photos/seed/ind-chik-003-2/800/600",
      "https://picsum.photos/seed/ind-chik-003-3/800/600"
    ],
    description: "Strategic logistics park with excellent highway connectivity, perfect for distribution centers, freight operations, or large-scale warehousing. The facility offers multiple units, ample parking for trucks, and is designed for efficient logistics operations."
  }
];

async function login() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
}

async function addProperty(property, token) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/properties`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(property),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `Failed to add property: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to add property "${property.title}":`, error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting property import...\n');
  console.log(`API URL: ${API_BASE_URL}`);
  console.log(`Username: ${ADMIN_USERNAME}\n`);

  try {
    // Login to get token
    console.log('📝 Logging in...');
    const token = await login();
    console.log('✅ Login successful!\n');

    // Add each property
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < propertiesToAdd.length; i++) {
      const property = propertiesToAdd[i];
      console.log(`[${i + 1}/${propertiesToAdd.length}] Adding: ${property.title}...`);
      
      try {
        const result = await addProperty(property, token);
        console.log(`✅ Successfully added: ${result.title} (ID: ${result.id})\n`);
        successCount++;
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.log(`❌ Failed to add: ${property.title}\n`);
        failCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Successfully added: ${successCount} properties`);
    console.log(`❌ Failed: ${failCount} properties`);
    console.log(`📦 Total: ${propertiesToAdd.length} properties\n`);

    if (successCount > 0) {
      console.log('🎉 Properties have been added successfully!');
      console.log('You can now view them in the admin dashboard and on the properties page.\n');
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();

