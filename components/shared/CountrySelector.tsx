"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Comprehensive list of countries
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "PL", name: "Poland" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "GR", name: "Greece" },
  { code: "CZ", name: "Czech Republic" },
  { code: "HU", name: "Hungary" },
  { code: "RO", name: "Romania" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "EE", name: "Estonia" },
  { code: "LV", name: "Latvia" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MT", name: "Malta" },
  { code: "CY", name: "Cyprus" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "KR", name: "South Korea" },
  { code: "SG", name: "Singapore" },
  { code: "HK", name: "Hong Kong" },
  { code: "TW", name: "Taiwan" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "VN", name: "Vietnam" },
  { code: "NZ", name: "New Zealand" },
  { code: "ZA", name: "South Africa" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "IL", name: "Israel" },
  { code: "TR", name: "Turkey" },
  { code: "RU", name: "Russia" },
  { code: "UA", name: "Ukraine" },
  { code: "EG", name: "Egypt" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "GH", name: "Ghana" },
  { code: "ET", name: "Ethiopia" },
  { code: "TZ", name: "Tanzania" },
  { code: "UG", name: "Uganda" },
  { code: "AO", name: "Angola" },
  { code: "DZ", name: "Algeria" },
  { code: "SD", name: "Sudan" },
  { code: "MA", name: "Morocco" },
  { code: "TN", name: "Tunisia" },
  { code: "LY", name: "Libya" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
  { code: "SN", name: "Senegal" },
  { code: "CI", name: "Ivory Coast" },
  { code: "CM", name: "Cameroon" },
  { code: "MG", name: "Madagascar" },
  { code: "MZ", name: "Mozambique" },
  { code: "ML", name: "Mali" },
  { code: "BF", name: "Burkina Faso" },
  { code: "NE", name: "Niger" },
  { code: "MW", name: "Malawi" },
  { code: "MW", name: "Malawi" },
  { code: "SO", name: "Somalia" },
  { code: "GN", name: "Guinea" },
  { code: "RW", name: "Rwanda" },
  { code: "BJ", name: "Benin" },
  { code: "BI", name: "Burundi" },
  { code: "TD", name: "Chad" },
  { code: "SL", name: "Sierra Leone" },
  { code: "TG", name: "Togo" },
  { code: "ER", name: "Eritrea" },
  { code: "CF", name: "Central African Republic" },
  { code: "LR", name: "Liberia" },
  { code: "MR", name: "Mauritania" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "DJ", name: "Djibouti" },
  { code: "GA", name: "Gabon" },
  { code: "LS", name: "Lesotho" },
  { code: "GM", name: "Gambia" },
  { code: "BW", name: "Botswana" },
  { code: "NA", name: "Namibia" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "MU", name: "Mauritius" },
  { code: "SC", name: "Seychelles" },
  { code: "CV", name: "Cape Verde" },
  { code: "ST", name: "São Tomé and Príncipe" },
  { code: "KM", name: "Comoros" },
  { code: "SW", name: "Swaziland" },
  { code: "GW", name: "Guinea-Bissau" },
].sort((a, b) => a.name.localeCompare(b.name));

interface CountrySelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function CountrySelector({ value, onValueChange, className }: CountrySelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select country" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {COUNTRIES.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

