import { Bed, Bath, Maximize } from "lucide-react";
import propertyImage from "@/assets/property-1.jpg";

interface PropertyCardProps {
  address: string;
  beds: number;
  baths: number;
  size: number;
  type: string;
  price: string;
  auctionDate: string;
}

const PropertyCard = ({
  address = "19 Abernethy Street, Weetangera",
  beds = 6,
  baths = 2,
  size = 5,
  type = "House",
  price = "$2500.00",
  auctionDate = "Auction 1:00pm Saturday 15 April",
}: Partial<PropertyCardProps>) => {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 animate-fade-in" style={{ animationDelay: "0.25s" }}>
      <div className="flex items-center justify-between px-6 pt-6 pb-3">
        <h3 className="text-lg font-semibold text-card-foreground">New List</h3>
        <button className="text-sm text-primary hover:underline">View All &gt;</button>
      </div>
      
      <div className="px-6 pb-6">
        <div className="rounded-lg overflow-hidden mb-4">
          <img
            src={propertyImage}
            alt={address}
            className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h4 className="font-semibold text-card-foreground mb-3">{address}</h4>

        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4" />
            <span>{beds}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4" />
            <span>{baths}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4" />
            <span>{size}</span>
          </div>
          <span className="text-muted-foreground">{type}</span>
        </div>

        <p className="text-xl font-bold text-card-foreground mb-1">{price}</p>
        <p className="text-sm text-muted-foreground">{auctionDate}</p>
      </div>
    </div>
  );
};

export default PropertyCard;
