import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('@tanstack')) {
              return 'query-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
          // Dashboard chunks - split by role
          if (id.includes('/pages/TenantDashboard')) {
            return 'tenant-dashboard';
          }
          if (id.includes('/pages/LandlordDashboard')) {
            return 'landlord-dashboard';
          }
          if (id.includes('/pages/SalesManagerDashboard')) {
            return 'salesmanager-dashboard';
          }
          if (id.includes('/pages/SuperAdminDashboard')) {
            return 'superadmin-dashboard';
          }
          if (id.includes('/pages/AdminDashboard')) {
            return 'admin-dashboard';
          }
          if (id.includes('/pages/AccountingDashboard')) {
            return 'accounting-dashboard';
          }
          if (id.includes('/pages/TechnicianDashboard')) {
            return 'technician-dashboard';
          }
          if (id.includes('/pages/CommercialDashboard')) {
            return 'commercial-dashboard';
          }
          if (id.includes('/pages/AgencyDirectorDashboard')) {
            return 'agencydirector-dashboard';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
