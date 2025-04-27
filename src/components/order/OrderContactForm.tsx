import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";

// Define schema for contact information
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export type ContactInfo = z.infer<typeof contactSchema>;

interface OrderContactFormProps {
  contactInfo: ContactInfo;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfo>>;
  showAddressField?: boolean;
  showNotes?: boolean;
}

const OrderContactForm = ({ 
  contactInfo, 
  setContactInfo, 
  showAddressField = true,
  showNotes = true
}: OrderContactFormProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateField = (name: keyof ContactInfo, value: string) => {
    try {
      const fieldSchema = contactSchema.shape[name];
      fieldSchema.parse(value);
      
      // Clear error if validation passes
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.errors[0]?.message || `Invalid ${name}`;
        setErrors(prev => ({ ...prev, [name]: errorMessage }));
      }
      return false;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof ContactInfo, value);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={contactInfo.name}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Your full name"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
            <Input
              id="phone"
              name="phone"
              value={contactInfo.phone}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Your phone number"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>
          
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={contactInfo.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              placeholder="Your email address"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          
          {showAddressField && (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Delivery Address (Optional)</Label>
              <Input
                id="address"
                name="address"
                value={contactInfo.address || ""}
                onChange={handleInputChange}
                placeholder="Your delivery address (if applicable)"
              />
            </div>
          )}
          
          {showNotes && (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Special Instructions (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={contactInfo.notes || ""}
                onChange={handleInputChange}
                placeholder="Any special instructions or notes for your order"
                rows={3}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderContactForm; 