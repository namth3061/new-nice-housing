const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'seeds', '001_properties.sql');
let content = fs.readFileSync(targetFile, 'utf8');

// 1. Update INSERT INTO
content = content.replace(
    '  image, images, raw_price, stars, rating, reviews, views, badge,\n  amenities, specs, detailed_amenities, max_guests',
    '  image, images, raw_price, price_type, stars, rating, reviews, views, badge,\n  amenities, specs, detailed_amenities, max_guests'
);

// 2. Update ON CONFLICT
content = content.replace(
    '  raw_price = EXCLUDED.raw_price,\n  stars = EXCLUDED.stars,',
    '  raw_price = EXCLUDED.raw_price,\n  price_type = EXCLUDED.price_type,\n  stars = EXCLUDED.stars,'
);

// 3. Update values (price, specs, text)
// A naive string replace strategy:
// Match each property block manually or just use string replaces for specific lines.

// Since it's easier, let's just do targeted regex replaces.
// Change "Khách sạn", "Resort" -> "Căn hộ" (Apartment)
// We'll replace the word Khách sạn with Căn hộ in descriptions.
content = content.replace(/Khách sạn/g, 'Căn hộ');
content = content.replace(/khách sạn/g, 'căn hộ');
content = content.replace(/Resort/g, 'Chung cư');
content = content.replace(/resort/g, 'chung cư');

// Fix raw prices and add price_type.
// Regex for:  <number>, <stars>, <rating>, '<reviews>'
// e.g. 4250000, 5, 9.4, '1.280',
content = content.replace(/(\s+)(\d{6,8})(,\s+\d,\s+[\d\.]+,\s+'[^']+',)/g, (match, space1, price, rest) => {
    const usdPrice = Math.floor(parseInt(price, 10) / 25000); // Rough conversion to USD
    return `${space1}${usdPrice}, 'month'${rest}`;
});

// Fix specs JSON
// '{"beds": "1 Giường King lớn", "guests": "2 Người lớn, 1 Trẻ em", "size": "60 m²"}'::jsonb
content = content.replace(/'\{"beds":[^}]+\}'::jsonb/g, () => {
    const bedrooms = Math.floor(Math.random() * 3) + 1;
    const bathrooms = Math.max(1, bedrooms - 1 + Math.floor(Math.random() * 2));
    const area = bedrooms * 30 + Math.floor(Math.random() * 20);
    return `'{"bedrooms": "${bedrooms}", "bathrooms": "${bathrooms}", "area": "${area}"}'::jsonb`;
});

// Replace ARRAY of old amenities with new ones.
// ARRAY['Hồ bơi', 'Spa', 'Bãi biển riêng'] -> ARRAY['Air conditioner', 'Balcony', 'Wi Fi']
const newAmenitiesOptions = ['Air conditioner', 'Balcony', 'Cable TV', 'Heater', 'Smoking', 'Washing machine', 'Wi Fi', 'Lift', 'Restaurant', 'Shop', 'Bus'];
content = content.replace(/ARRAY\[[^\]]+\]/g, (match) => {
    if (match.includes('http')) return match; // skip image arrays
    // Pick 4 random amenities
    const shuffled = [...newAmenitiesOptions].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 4);
    return `ARRAY[${picked.map(a => `'${a}'`).join(', ')}]`;
});

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Done rewriting properties.sql');
