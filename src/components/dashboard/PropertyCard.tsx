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
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.25s" }}>
      <div className="flex items-center justify-between px-7 pt-7 pb-4">
        <h3 className="text-lg font-bold text-card-foreground">New Listing</h3>
        <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          View All →
        </button>
      </div>

      <div className="px-7 pb-7">
        <div className="rounded-xl overflow-hidden mb-5 shadow-sm">
          <img
            src={propertyImage}
            alt={address}
            className="w-full h-44 object-cover hover:scale-110 transition-transform duration-500"
          />
        </div>

        <h4 className="font-bold text-card-foreground mb-4 text-base leading-snug">{address}</h4>

        <div className="flex items-center gap-5 text-muted-foreground text-sm mb-5 pb-5 border-b border-border">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4" />
            <span className="font-medium">{beds}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-4 h-4" />
            <span className="font-medium">{baths}</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize className="w-4 h-4" />
            <span className="font-medium">{size}</span>
          </div>
          <span className="text-xs px-2.5 py-1 bg-secondary rounded-full font-medium">{type}</span>
        </div>

        <div className="space-y-2">
          <p className="text-2xl font-bold text-card-foreground">{price}</p>
          <p className="text-sm text-muted-foreground font-medium">{auctionDate}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
