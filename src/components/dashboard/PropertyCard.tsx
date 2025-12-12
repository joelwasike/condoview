import { useEffect, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { agencyDirectorService } from "@/services/agencyDirectorService";
import { salesManagerService } from "@/services/salesManagerService";
import { commercialService } from "@/services/commercialService";
import { adminService } from "@/services/adminService";
import { accountingService } from "@/services/accountingService";
import { technicianService } from "@/services/technicianService";
import { landlordService } from "@/services/landlordService";
import { tenantService } from "@/services/tenantService";
import { superAdminService } from "@/services/superAdminService";
import { API_CONFIG } from "@/config/api";

interface Advertisement {
  id: number;
  title?: string;
  description?: string;
  ImageURL?: string;
  imageUrl?: string;
  imageURL?: string;
  link?: string;
  createdAt?: string;
}

const PropertyCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDemoMode = localStorage.getItem('demo_mode') === 'true';
  
  // Get user role
  const userRole = useMemo(() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user)?.role : null;
    } catch {
      return null;
    }
  }, []);

  // Generate mock advertisements for demo mode
  const mockAdvertisements: Advertisement[] = useMemo(() => [
    {
      id: 1,
      title: "Premium Property Listing",
      description: "Discover luxury properties in prime locations",
      ImageURL: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "New Development Project",
      description: "Modern apartments with stunning views",
      ImageURL: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Investment Opportunity",
      description: "High ROI properties for smart investors",
      ImageURL: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
    },
  ], []);

  // Determine which service to use based on role
  const getAdvertisementsService = () => {
    switch (userRole) {
      case 'agency_director':
        return agencyDirectorService.getAdvertisements;
      case 'salesmanager':
        return salesManagerService.getAdvertisements;
      case 'commercial':
        return commercialService.getAdvertisements;
      case 'admin':
        return adminService.getAdvertisements;
      case 'accounting':
        return accountingService.getAdvertisements;
      case 'technician':
        return technicianService.getAdvertisements;
      case 'landlord':
        return landlordService.getAdvertisements;
      case 'tenant':
        return tenantService.getAdvertisements;
      case 'superadmin':
        return superAdminService.getAdvertisements;
      default:
        return agencyDirectorService.getAdvertisements;
    }
  };

  // Fetch advertisements
  const { data: advertisementsData } = useQuery({
    queryKey: ['advertisements', userRole],
    queryFn: async () => {
      if (isDemoMode) {
        return mockAdvertisements;
      }
      const service = getAdvertisementsService();
      return await service();
    },
    enabled: !isDemoMode || true,
    retry: 1,
  });

  const advertisements: Advertisement[] = useMemo(() => {
    if (isDemoMode) {
      return mockAdvertisements;
    }
    return Array.isArray(advertisementsData) ? advertisementsData : [];
  }, [advertisementsData, isDemoMode, mockAdvertisements]);

  // Auto-rotate advertisements every 5 seconds
  useEffect(() => {
    if (advertisements.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % advertisements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [advertisements.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + advertisements.length) % advertisements.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % advertisements.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (advertisements.length === 0) {
    return (
      <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border animate-fade-in" style={{ animationDelay: "0.25s" }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="text-base font-semibold text-card-foreground">Advertisements</h3>
        </div>
        <div className="px-5 pb-5">
          <div className="text-center py-10 text-muted-foreground">
            <p className="text-xs">No advertisements available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentAd = advertisements[currentIndex];
  const imageUrl = currentAd.ImageURL || currentAd.imageUrl || currentAd.imageURL;
  const fullImageUrl = imageUrl 
    ? (imageUrl.startsWith('http') ? imageUrl : `${API_CONFIG.BASE_URL}${imageUrl}`)
    : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop";

  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all duration-300 animate-fade-in" style={{ animationDelay: "0.25s" }}>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h3 className="text-base font-semibold text-card-foreground">Advertisements</h3>
        {advertisements.length > 1 && (
          <div className="flex items-center gap-1">
            {advertisements.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex ? 'bg-primary w-3' : 'bg-muted-foreground/30'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-5 relative">
        {/* Image Container with Carousel */}
        <div className="rounded-lg overflow-hidden mb-3 shadow-sm relative group">
          <div className="relative w-full h-36 overflow-hidden">
            {advertisements.map((ad, index) => {
              const adImageUrl = ad.ImageURL || ad.imageUrl || ad.imageURL;
              const adFullImageUrl = adImageUrl 
                ? (adImageUrl.startsWith('http') ? adImageUrl : `${API_CONFIG.BASE_URL}${adImageUrl}`)
                : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop";
              
              return (
                <div
                  key={ad.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={adFullImageUrl}
                    alt={ad.title || `Advertisement ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>
          
          {/* Navigation Arrows */}
          {advertisements.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Previous advertisement"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Next advertisement"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Advertisement Content */}
        {currentAd.title && (
          <h4 className="font-semibold text-card-foreground mb-1.5 text-sm leading-snug line-clamp-2">
            {currentAd.title}
          </h4>
        )}
        
        {currentAd.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {currentAd.description}
          </p>
        )}

        {/* Slide Indicator */}
        {advertisements.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-2 border-t border-border">
            <span className="text-[10px] text-muted-foreground">
              {currentIndex + 1} / {advertisements.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
