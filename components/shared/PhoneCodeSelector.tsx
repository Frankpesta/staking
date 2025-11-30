"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Common phone country codes
const PHONE_CODES = [
  { code: "+1", country: "US/CA", name: "United States/Canada" },
  { code: "+44", country: "GB", name: "United Kingdom" },
  { code: "+61", country: "AU", name: "Australia" },
  { code: "+49", country: "DE", name: "Germany" },
  { code: "+33", country: "FR", name: "France" },
  { code: "+39", country: "IT", name: "Italy" },
  { code: "+34", country: "ES", name: "Spain" },
  { code: "+31", country: "NL", name: "Netherlands" },
  { code: "+32", country: "BE", name: "Belgium" },
  { code: "+41", country: "CH", name: "Switzerland" },
  { code: "+43", country: "AT", name: "Austria" },
  { code: "+46", country: "SE", name: "Sweden" },
  { code: "+47", country: "NO", name: "Norway" },
  { code: "+45", country: "DK", name: "Denmark" },
  { code: "+358", country: "FI", name: "Finland" },
  { code: "+48", country: "PL", name: "Poland" },
  { code: "+353", country: "IE", name: "Ireland" },
  { code: "+351", country: "PT", name: "Portugal" },
  { code: "+30", country: "GR", name: "Greece" },
  { code: "+420", country: "CZ", name: "Czech Republic" },
  { code: "+36", country: "HU", name: "Hungary" },
  { code: "+40", country: "RO", name: "Romania" },
  { code: "+359", country: "BG", name: "Bulgaria" },
  { code: "+385", country: "HR", name: "Croatia" },
  { code: "+421", country: "SK", name: "Slovakia" },
  { code: "+386", country: "SI", name: "Slovenia" },
  { code: "+372", country: "EE", name: "Estonia" },
  { code: "+371", country: "LV", name: "Latvia" },
  { code: "+370", country: "LT", name: "Lithuania" },
  { code: "+352", country: "LU", name: "Luxembourg" },
  { code: "+356", country: "MT", name: "Malta" },
  { code: "+357", country: "CY", name: "Cyprus" },
  { code: "+81", country: "JP", name: "Japan" },
  { code: "+86", country: "CN", name: "China" },
  { code: "+91", country: "IN", name: "India" },
  { code: "+82", country: "KR", name: "South Korea" },
  { code: "+65", country: "SG", name: "Singapore" },
  { code: "+852", country: "HK", name: "Hong Kong" },
  { code: "+886", country: "TW", name: "Taiwan" },
  { code: "+60", country: "MY", name: "Malaysia" },
  { code: "+66", country: "TH", name: "Thailand" },
  { code: "+62", country: "ID", name: "Indonesia" },
  { code: "+63", country: "PH", name: "Philippines" },
  { code: "+84", country: "VN", name: "Vietnam" },
  { code: "+64", country: "NZ", name: "New Zealand" },
  { code: "+27", country: "ZA", name: "South Africa" },
  { code: "+55", country: "BR", name: "Brazil" },
  { code: "+52", country: "MX", name: "Mexico" },
  { code: "+54", country: "AR", name: "Argentina" },
  { code: "+56", country: "CL", name: "Chile" },
  { code: "+57", country: "CO", name: "Colombia" },
  { code: "+51", country: "PE", name: "Peru" },
  { code: "+971", country: "AE", name: "United Arab Emirates" },
  { code: "+966", country: "SA", name: "Saudi Arabia" },
  { code: "+972", country: "IL", name: "Israel" },
  { code: "+90", country: "TR", name: "Turkey" },
  { code: "+7", country: "RU", name: "Russia" },
  { code: "+380", country: "UA", name: "Ukraine" },
  { code: "+20", country: "EG", name: "Egypt" },
  { code: "+234", country: "NG", name: "Nigeria" },
  { code: "+254", country: "KE", name: "Kenya" },
  { code: "+233", country: "GH", name: "Ghana" },
  { code: "+251", country: "ET", name: "Ethiopia" },
  { code: "+255", country: "TZ", name: "Tanzania" },
  { code: "+256", country: "UG", name: "Uganda" },
  { code: "+244", country: "AO", name: "Angola" },
  { code: "+213", country: "DZ", name: "Algeria" },
  { code: "+249", country: "SD", name: "Sudan" },
  { code: "+212", country: "MA", name: "Morocco" },
  { code: "+216", country: "TN", name: "Tunisia" },
  { code: "+218", country: "LY", name: "Libya" },
  { code: "+260", country: "ZM", name: "Zambia" },
  { code: "+263", country: "ZW", name: "Zimbabwe" },
  { code: "+221", country: "SN", name: "Senegal" },
  { code: "+225", country: "CI", name: "Ivory Coast" },
  { code: "+237", country: "CM", name: "Cameroon" },
  { code: "+261", country: "MG", name: "Madagascar" },
  { code: "+258", country: "MZ", name: "Mozambique" },
  { code: "+223", country: "ML", name: "Mali" },
  { code: "+226", country: "BF", name: "Burkina Faso" },
  { code: "+227", country: "NE", name: "Niger" },
  { code: "+265", country: "MW", name: "Malawi" },
  { code: "+252", country: "SO", name: "Somalia" },
  { code: "+224", country: "GN", name: "Guinea" },
  { code: "+250", country: "RW", name: "Rwanda" },
  { code: "+229", country: "BJ", name: "Benin" },
  { code: "+257", country: "BI", name: "Burundi" },
  { code: "+235", country: "TD", name: "Chad" },
  { code: "+232", country: "SL", name: "Sierra Leone" },
  { code: "+228", country: "TG", name: "Togo" },
  { code: "+291", country: "ER", name: "Eritrea" },
  { code: "+236", country: "CF", name: "Central African Republic" },
  { code: "+231", country: "LR", name: "Liberia" },
  { code: "+222", country: "MR", name: "Mauritania" },
  { code: "+245", country: "GW", name: "Guinea-Bissau" },
  { code: "+253", country: "DJ", name: "Djibouti" },
  { code: "+241", country: "GA", name: "Gabon" },
  { code: "+266", country: "LS", name: "Lesotho" },
  { code: "+220", country: "GM", name: "Gambia" },
  { code: "+267", country: "BW", name: "Botswana" },
  { code: "+264", country: "NA", name: "Namibia" },
  { code: "+240", country: "GQ", name: "Equatorial Guinea" },
  { code: "+230", country: "MU", name: "Mauritius" },
  { code: "+248", country: "SC", name: "Seychelles" },
  { code: "+238", country: "CV", name: "Cape Verde" },
  { code: "+239", country: "ST", name: "São Tomé and Príncipe" },
  { code: "+269", country: "KM", name: "Comoros" },
  { code: "+268", country: "SW", name: "Swaziland" },
].sort((a, b) => a.code.localeCompare(b.code));

interface PhoneCodeSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function PhoneCodeSelector({ value, onValueChange, className }: PhoneCodeSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Code" />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {PHONE_CODES.map((item) => (
          <SelectItem key={item.code} value={item.code}>
            {item.code} {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

