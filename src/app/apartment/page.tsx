import * as Property from "@/models/Property";
import { propertyToHotel } from "@/lib/propertyToHotel";
import { ListPageClient } from "@/components/ListPageClient/ListPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Căn hộ",
};

export default async function ApartmentListPage(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams.page as string || "1", 10));
  const stars = searchParams.stars as string || undefined;
  const amenities = searchParams.amenities as string || undefined;
  const province = searchParams.province as string || undefined;

  let price_min = undefined;
  let price_max = undefined;
  const priceParam = searchParams.price as string || "";

  if (priceParam) {
    const priceArr = priceParam.split(',');
    let min = Infinity;
    let max = -Infinity;
    // The "2" corresponds to million VND technically before, but now we use USD logically in the backend bounds
    if (priceArr.includes('under2')) { min = Math.min(min, 0); max = Math.max(max, 100); }
    if (priceArr.includes('2to5')) { min = Math.min(min, 100); max = Math.max(max, 500); }
    if (priceArr.includes('above5')) { min = Math.min(min, 500); max = Math.max(max, 999999); }

    if (min !== Infinity) price_min = min;
    if (max !== -Infinity && max !== 999999) price_max = max; // if we have above5, don't set a max limit
  }

  const data = await Property.findPropertiesPaginated({
    search: searchParams.search as string || undefined,
    stars: stars ? `${stars.split(',')[0]}star` : undefined, // Model expects "5star", "4star"
    price_min,
    price_max,
    amenities,
    province,
    status: "available",
    page,
    limit: 10,
  });

  const hotels = data.list.map((p: any) => propertyToHotel(p));

  const initialFilters = {
    price: priceParam ? priceParam.split(',') : [],
    stars: stars ? stars.split(',').map(s => parseInt(s, 10)).filter(n => !isNaN(n)) : [],
    amenities: amenities ? amenities.split(',') : [],
    province: province || "",
  };

  return <ListPageClient basePath="/apartment" hotels={hotels} total={data.total} totalPages={data.totalPages} currentPage={page} initialFilters={initialFilters} />;
}
