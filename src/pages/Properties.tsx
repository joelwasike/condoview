import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Bed, Bath, Maximize, MapPin, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import propertyImage from "@/assets/property-1.jpg";

const properties = [
  {
    id: 1,
    address: "19 Abernethy Street, Weetangera",
    beds: 6,
    baths: 2,
    size: 5,
    type: "House",
    price: "$2,500",
    status: "For Sale",
    image: propertyImage,
  },
  {
    id: 2,
    address: "42 Ocean Drive, Bondi Beach",
    beds: 4,
    baths: 3,
    size: 4,
    type: "Apartment",
    price: "$1,800/mo",
    status: "For Rent",
    image: propertyImage,
  },
  {
    id: 3,
    address: "15 Park Avenue, Melbourne",
    beds: 3,
    baths: 2,
    size: 3,
    type: "Condo",
    price: "$3,200",
    status: "For Sale",
    image: propertyImage,
  },
  {
    id: 4,
    address: "88 Harbor View, Sydney",
    beds: 5,
    baths: 4,
    size: 6,
    type: "Villa",
    price: "$4,500",
    status: "For Sale",
    image: propertyImage,
  },
  {
    id: 5,
    address: "27 Sunset Boulevard, Perth",
    beds: 2,
    baths: 1,
    size: 2,
    type: "Studio",
    price: "$950/mo",
    status: "For Rent",
    image: propertyImage,
  },
  {
    id: 6,
    address: "103 River Road, Brisbane",
    beds: 4,
    baths: 2,
    size: 4,
    type: "House",
    price: "$2,100/mo",
    status: "For Rent",
    image: propertyImage,
  },
];

const PropertyCard = ({ property }: { property: typeof properties[0] }) => (
  <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 animate-fade-in">
    <div className="relative">
      <img
        src={property.image}
        alt={property.address}
        className="w-full h-48 object-cover"
      />
      <Badge
        className={`absolute top-3 left-3 ${
          property.status === "For Sale"
            ? "bg-primary text-primary-foreground"
            : "bg-accent text-accent-foreground"
        }`}
      >
        {property.status}
      </Badge>
      <button className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground">
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
    <div className="p-5">
      <div className="flex items-start gap-2 mb-3">
        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <h3 className="font-semibold text-card-foreground line-clamp-1">{property.address}</h3>
      </div>
      <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
        <div className="flex items-center gap-1.5">
          <Bed className="w-4 h-4" />
          <span>{property.beds}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Bath className="w-4 h-4" />
          <span>{property.baths}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Maximize className="w-4 h-4" />
          <span>{property.size}</span>
        </div>
        <span className="text-xs px-2 py-0.5 bg-secondary rounded">{property.type}</span>
      </div>
      <p className="text-xl font-bold text-card-foreground">{property.price}</p>
    </div>
  </div>
);

const Properties = () => {
  return (
    <DashboardLayout title="Properties">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            All Properties
          </button>
          <button className="px-4 py-2 bg-card text-muted-foreground rounded-lg text-sm font-medium hover:bg-secondary">
            For Sale
          </button>
          <button className="px-4 py-2 bg-card text-muted-foreground rounded-lg text-sm font-medium hover:bg-secondary">
            For Rent
          </button>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
          + Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property, index) => (
          <div key={property.id} style={{ animationDelay: `${index * 0.05}s` }}>
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Properties;
