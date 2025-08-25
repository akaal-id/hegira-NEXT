/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useRef } from 'react';
import { BusinessMatchingCardData } from '../BusinessMatchingCard'; // Ensure this path is correct

interface VendorMapProps {
  vendors: BusinessMatchingCardData[];
  center: [number, number];
  zoom: number;
  radius?: number; // in meters
  activeVendorId?: number | null;
  onMarkerClick?: (vendor: BusinessMatchingCardData) => void;
}

// Icons and leaflet references will be created client-side to avoid SSR issues
let hegraTurquoiseIcon: any = null;
let hegraYellowIcon: any = null;
let Leaflet: any = null;


const VendorMap: React.FC<VendorMapProps> = ({ vendors, center, zoom, radius, activeVendorId, onMarkerClick }) => {
  const mapRef = useRef<any | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const radiusCircleRef = useRef<any | null>(null);
  const markersRef = useRef<any | null>(null);

  useEffect(() => {
    // Only run leaflet code on the client
    if (typeof window === 'undefined') return;
    // Dynamically require leaflet to avoid SSR import
    if (!Leaflet) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      Leaflet = require('leaflet');
      const hegraBaseIcon = Leaflet.Icon.extend({
        options: {
          iconSize: [28, 41],
          iconAnchor: [14, 41],
          popupAnchor: [0, -38],
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
          shadowSize: [41, 41]
        }
      });
      hegraTurquoiseIcon = new hegraBaseIcon({ iconUrl: 'https://img.icons8.com/ios-filled/50/4b998e/marker.png' });
      hegraYellowIcon = new hegraBaseIcon({ iconUrl: 'https://img.icons8.com/ios-filled/50/ebaf4c/marker.png' });
    }

    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = Leaflet.map(mapContainerRef.current).setView(center, zoom);
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      markersRef.current = Leaflet.layerGroup().addTo(mapRef.current);
    }

    // Update map view if center or zoom props change
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }

  }, [center, zoom]); // Initial map setup and view updates

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mapRef.current && markersRef.current) {
      markersRef.current.clearLayers(); // Clear existing markers
      vendors.forEach(vendor => {
        if (vendor.lat && vendor.lng) {
          const iconToUse = vendor.id === activeVendorId ? hegraYellowIcon : hegraTurquoiseIcon;
          const marker = Leaflet.marker([vendor.lat, vendor.lng], { icon: iconToUse })
            .addTo(markersRef.current!)
            .bindPopup(`<b>${vendor.name}</b><br>${vendor.sector}<br><small>${vendor.location}</small>`);
          
          if (onMarkerClick) {
            marker.on('click', () => onMarkerClick(vendor));
          }
        }
      });
    }
  }, [vendors, activeVendorId, onMarkerClick]); // Update markers when vendors or activeVendorId changes


  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mapRef.current) {
      if (radiusCircleRef.current) {
        mapRef.current.removeLayer(radiusCircleRef.current);
        radiusCircleRef.current = null;
      }
      if (radius && radius > 0) {
        radiusCircleRef.current = Leaflet.circle(mapRef.current.getCenter(), {
          radius: radius,
          color: '#F5AF47',
          fillColor: '#F5AF47',
          fillOpacity: 0.1,
          weight: 2
        }).addTo(mapRef.current);
      }
    }
  }, [radius, center]); // Update radius circle

  return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />;
};

export default VendorMap;